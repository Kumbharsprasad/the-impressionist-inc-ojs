import { db } from '@/db/index';
import { submissions, users, reviews, conferences, conferenceParticipants } from '@/db/schema';
import { eq, desc, and, inArray } from 'drizzle-orm';
import { Card } from '@/components/ui/Card';
import AssignReviewerDialog from '@/components/dashboard/AssignReviewerDialog';
import { FileText, Calendar, User as UserIcon, LayoutGrid, MessageSquare, Quote, Download, CheckCircle2, Clock } from 'lucide-react';
import CreateConferenceRoom from '@/components/dashboard/CreateConferenceRoom';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default async function EditorDashboard({ editorId }: { editorId: number }) {
    // 1. Fetch journals owned by this editor to filter everything else
    const myConferences = await db.select({ id: conferences.id })
        .from(conferences)
        .where(eq(conferences.editorId, editorId));

    const myConferenceIds = myConferences.map(c => c.id);

    if (myConferenceIds.length === 0) {
        return (
            <div className="space-y-16 text-left">
                <section className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <LayoutGrid className="w-6 h-6 text-bright-blue" />
                        <h2 className="text-xl font-black text-navy uppercase tracking-widest">Agenda Management</h2>
                    </div>
                    <CreateConferenceRoom />
                </section>
                <div className="py-20 bg-slate-50 border-4 border-dashed border-slate-100 rounded-[40px] text-center">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Create your first journal room to see submissions.</p>
                </div>
            </div>
        );
    }

    // 2. Fetch submissions in these conferences
    const allSubmissions = await db.select({
        id: submissions.id,
        title: submissions.title,
        author: users.name,
        status: submissions.status,
        createdAt: submissions.createdAt,
        theme: submissions.theme,
        pdfUrl: submissions.pdfUrl,
        conferenceName: conferences.name
    })
        .from(submissions)
        .leftJoin(users, eq(submissions.authorId, users.id))
        .innerJoin(conferences, eq(submissions.conferenceId, conferences.id))
        .where(inArray(submissions.conferenceId, myConferenceIds))
        .orderBy(desc(submissions.createdAt));

    // 3. Fetch ONLY reviewers who have joined the editor's conferences
    const roomReviewers = await db.selectDistinct({
        id: users.id,
        name: users.name
    })
        .from(users)
        .innerJoin(conferenceParticipants, eq(users.id, conferenceParticipants.userId))
        .innerJoin(conferences, eq(conferenceParticipants.conferenceId, conferences.id))
        .where(and(
            eq(users.role, 'reviewer'),
            eq(conferences.editorId, editorId)
        ));

    // 4. Fetch all reviews for these submissions to show "Dialogue"
    const submissionIds = allSubmissions.map(s => s.id);
    let allReviews: any[] = [];
    if (submissionIds.length > 0) {
        allReviews = await db.select({
            id: reviews.id,
            submissionId: reviews.submissionId,
            reviewerName: users.name,
            feedback: reviews.feedback,
            decision: reviews.decision,
            completedAt: reviews.completedAt,
        })
            .from(reviews)
            .leftJoin(users, eq(reviews.reviewerId, users.id))
            .where(inArray(reviews.submissionId, submissionIds))
            .orderBy(desc(reviews.createdAt));
    }

    return (
        <div className="space-y-16 text-left">
            <section className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                    <LayoutGrid className="w-6 h-6 text-bright-blue" />
                    <h2 className="text-xl font-black text-navy uppercase tracking-widest">Agenda Management</h2>
                </div>
                <CreateConferenceRoom />
            </section>

            <section className="space-y-8">
                <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                    <h1 className="text-3xl font-black text-navy uppercase tracking-tight">Active Room Pipeline</h1>
                    <div className="bg-slate-100 px-4 py-2 rounded-xl text-xs font-black text-slate-500 uppercase tracking-widest">
                        {allSubmissions.length} Manuscripts Identified
                    </div>
                </div>

                <div className="grid gap-12">
                    {allSubmissions.map((sub) => {
                        const feedbackForSub = allReviews.filter(r => r.submissionId === sub.id && r.feedback);
                        const activeAssignments = allReviews.filter(r => r.submissionId === sub.id);

                        return (
                            <Card key={sub.id} className="flex flex-col p-10 pb-32 bg-white hover:shadow-2xl transition-all border-2 border-slate-100 rounded-[40px] relative z-10 hover:z-[50] focus-within:z-[50]">
                                <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                                    <div className="space-y-4 flex-1">
                                        <div className="flex flex-wrap items-center gap-4">
                                            <span className={`w-3.5 h-3.5 rounded-full ${sub.status === 'accepted' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' :
                                                sub.status === 'rejected' ? 'bg-red-500' :
                                                    sub.status === 'under_review' ? 'bg-amber-500 animate-pulse' : 'bg-medium-blue'
                                                }`} />
                                            <h3 className="font-black text-2xl text-navy leading-tight">{sub.title}</h3>
                                            <span className="text-[10px] px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-black uppercase tracking-widest">{sub.status?.replace('_', ' ')}</span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 font-bold">
                                            <span className="flex items-center gap-2 text-navy/70"><UserIcon className="w-4 h-4 text-medium-blue" /> {sub.author}</span>
                                            <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-medium-blue" /> {sub.createdAt?.toLocaleDateString()}</span>
                                            <span className="bg-medium-blue/5 text-medium-blue px-3 py-1 rounded-full border border-medium-blue/10 font-black">{sub.conferenceName}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                                        <Link href={sub.pdfUrl} target="_blank">
                                            <Button variant="outline" className="w-full sm:w-auto h-12 rounded-2xl border-slate-200 hover:border-bright-blue text-navy font-black text-xs uppercase tracking-widest">
                                                <Download className="w-4 h-4 mr-2" />
                                                Review Manuscript
                                            </Button>
                                        </Link>

                                        {/* Requirement 1: Assign more than two people, only invited reviewers visible */}
                                        <AssignReviewerDialog submissionId={sub.id} reviewers={roomReviewers} />
                                    </div>
                                </div>

                                {/* Requirement 2 & 3: Discussion/Dialogue Visibility & Progress Tracking */}
                                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Review Assignments Status */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-navy uppercase tracking-widest flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-medium-blue" />
                                            Active Assignments ({activeAssignments.length})
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {activeAssignments.map((rev, idx) => (
                                                <div key={idx} className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 ${rev.completedAt ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-500'
                                                    }`}>
                                                    {rev.completedAt ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-2 h-2 rounded-full bg-slate-300 animate-pulse" />}
                                                    {rev.reviewerName}
                                                </div>
                                            ))}
                                            {activeAssignments.length === 0 && <span className="text-xs text-slate-400 italic">No reviewers assigned yet</span>}
                                        </div>
                                    </div>

                                    {/* Revision Dialogue Visibility */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-navy uppercase tracking-widest flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4 text-medium-blue" />
                                            Communication Log
                                        </h4>
                                        <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                            {feedbackForSub.length > 0 ? feedbackForSub.map((f, i) => (
                                                <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative group">
                                                    <Quote className="absolute right-4 top-4 w-4 h-4 text-medium-blue opacity-10" />
                                                    <p className="text-[11px] font-black text-bright-blue uppercase mb-1">{f.reviewerName} says:</p>
                                                    <p className="text-sm text-slate-600 font-medium italic leading-relaxed">"{f.feedback}"</p>
                                                    <div className="mt-2 flex items-center justify-between">
                                                        <span className="text-[9px] font-black text-slate-400 flex items-center gap-1 uppercase">
                                                            Decision: <span className={
                                                                f.decision === 'accept' ? 'text-emerald-500' :
                                                                    f.decision === 'reject' ? 'text-red-500' : 'text-amber-500'
                                                            }>{f.decision}</span>
                                                        </span>
                                                        <span className="text-[9px] font-black text-slate-300">{f.completedAt?.toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            )) : (
                                                <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl border border-slate-100">No communication logs recorded for this stage.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {sub.status === 'accepted' && (
                                    <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-emerald-600">
                                            <CheckCircle2 className="w-6 h-6" />
                                            <span className="text-sm font-black uppercase tracking-tight">Finalized & Qualified for Publication</span>
                                        </div>
                                        <Link href={`/dashboard/actions/publish/${sub.id}`}>
                                            <Button size="sm" className="bg-navy hover:bg-black text-[10px] h-10 px-6 rounded-xl font-black uppercase tracking-widest border-none">
                                                Finalize Production
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
