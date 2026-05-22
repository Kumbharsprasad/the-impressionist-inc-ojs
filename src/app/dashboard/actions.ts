'use server';

import { db } from '@/db/index';
import { submissions, users, reviews, conferences, conferenceParticipants } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

function generateRoomKey() {
    return Math.random().toString(36).substring(2, 5).toUpperCase() + '-' + Math.random().toString(36).substring(2, 5).toUpperCase();
}

// --- Submission Actions ---

export async function createSubmission(formData: FormData) {
    const session = await getSession();
    if (!session || session.user.role !== 'author') return { error: 'Unauthorized' };

    const title = formData.get('title') as string;
    const abstract = formData.get('abstract') as string;
    const theme = formData.get('theme') as string;
    const keywords = formData.get('keywords') as string;
    const pdfUrl = formData.get('pdfUrl') as string;
    const conferenceIdStr = formData.get('conferenceId') as string;
    const conferenceId = conferenceIdStr ? parseInt(conferenceIdStr) : null;

    if (!conferenceId) return { error: 'Manuscripts must be submitted within a specific Journal Room agenda.' };
    if (!pdfUrl) return { error: 'PDF upload failed' };

    try {
        await db.insert(submissions).values({
            authorId: session.user.id,
            conferenceId,
            title,
            abstract,
            theme,
            keywords,
            pdfUrl,
            status: 'submitted',
        });
    } catch (e) {
        console.error(e);
        return { error: 'Database Error' };
    }

    if (conferenceId) {
        revalidatePath(`/dashboard/rooms/${conferenceId}`);
        redirect(`/dashboard/rooms/${conferenceId}`);
    } else {
        revalidatePath('/dashboard');
        redirect('/dashboard');
    }
}

// ... existing actions ...

export async function createConferenceRoom(formData: FormData) {
    const session = await getSession();
    if (!session || session.user.role !== 'editor') return { error: 'Unauthorized' };

    const name = formData.get('name') as string;
    const theme = formData.get('theme') as string;
    const agenda = formData.get('agenda') as string;
    const roomKey = generateRoomKey();

    try {
        await db.insert(conferences).values({
            editorId: session.user.id,
            name,
            theme,
            agenda,
            roomKey,
        });
        revalidatePath('/dashboard/editor');
        return { success: true, roomKey };
    } catch (e) {
        return { error: 'Failed to create room' };
    }
}

export async function joinConferenceRoom(roomKey: string) {
    const session = await getSession();
    if (!session) return { error: 'Login required' };

    try {
        const room = await db.select().from(conferences).where(eq(conferences.roomKey, roomKey)).limit(1);
        if (room.length === 0) return { error: 'Invalid room key' };

        // Check if already joined
        const existing = await db.select().from(conferenceParticipants)
            .where(and(
                eq(conferenceParticipants.conferenceId, room[0].id),
                eq(conferenceParticipants.userId, session.user.id)
            )).limit(1);

        if (existing.length > 0) return { error: 'Already in room' };

        await db.insert(conferenceParticipants).values({
            conferenceId: room[0].id,
            userId: session.user.id,
            role: session.user.role as any,
        });

        revalidatePath('/dashboard');
        return { success: true, conferenceId: room[0].id };
    } catch (e) {
        return { error: 'Failed to join room' };
    }
}

export async function assignReviewerAction(submissionId: number, reviewerId: number) {
    const session = await getSession();
    if (!session || session.user.role !== 'editor') return { error: 'Unauthorized' };

    try {
        await db.insert(reviews).values({
            submissionId,
            reviewerId,
        });

        await db.update(submissions)
            .set({ status: 'under_review' })
            .where(eq(submissions.id, submissionId));

        revalidatePath('/dashboard/submissions');
    } catch (e) {
        return { error: 'Assignment Failed' };
    }
}

export async function submitReviewAction(reviewId: number, feedback: string, decision: 'accept' | 'revision' | 'reject') {
    const session = await getSession();
    if (!session || session.user.role !== 'reviewer') return { error: 'Unauthorized' };

    try {
        await db.update(reviews)
            .set({
                feedback,
                decision,
                completedAt: new Date()
            })
            .where(eq(reviews.id, reviewId));

        // Also update submission status if needed based on decision?
        // Simpler: Just mark review done. Editor sees it.
        // OR: Automatic status update.
        const statusMap = {
            'accept': 'accepted',
            'revision': 'revision_requested',
            'reject': 'rejected'
        };

        // Fetch submission ID first
        const review = await db.select().from(reviews).where(eq(reviews.id, reviewId)).limit(1);
        if (review.length > 0) {
            await db.update(submissions)
                .set({ status: statusMap[decision] as any })
                .where(eq(submissions.id, review[0].submissionId));
        }

    } catch (e) {
        return { error: 'Review Submission Failed' };
    }

    revalidatePath('/dashboard/reviews');
}

export async function uploadRevisionAction(submissionId: number, pdfUrl: string) {
    const session = await getSession();
    if (!session || session.user.role !== 'author') return { error: 'Unauthorized' };

    try {
        // 1. Update submission status and PDF
        await db.update(submissions)
            .set({
                pdfUrl,
                status: 'revision_submitted',
                updatedAt: new Date()
            })
            .where(eq(submissions.id, submissionId));

        // 2. Find the unique previous reviewer(s)
        const previousReviews = await db.select({ reviewerId: reviews.reviewerId })
            .from(reviews)
            .where(eq(reviews.submissionId, submissionId));

        const uniqueReviewerIds = Array.from(new Set(previousReviews.map(r => r.reviewerId)));

        // 3. Create fresh review requests for each unique previous reviewer
        for (const reviewerId of uniqueReviewerIds) {
            await db.insert(reviews).values({
                submissionId,
                reviewerId: reviewerId,
            });
        }

        revalidatePath('/dashboard');
    } catch (e) {
        console.error(e);
        return { error: 'Revision Upload Failed' };
    }
}
