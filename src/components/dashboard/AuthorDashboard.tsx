import { db } from '@/db/index';
import { submissions, users, reviews, conferences, conferenceParticipants } from '@/db/schema';
import { eq, desc, and, isNotNull } from 'drizzle-orm';
import { Card } from '@/components/ui/Card';
import { Calendar, FileText, MessageSquare, Quote, Shield, ArrowRight } from 'lucide-react';
import NewSubmissionForm from './NewSubmissionForm';
import RevisionUpload from './RevisionUpload';
import { Button } from '@/components/ui/Button';
import JoinConferenceRoom from './JoinConferenceRoom';
import Link from 'next/link';

export default async function AuthorDashboard({ authorId }: { authorId: number }) {
    const rawSubmissions = await db.select()
        .from(submissions)
        .where(eq(submissions.authorId, authorId))
        .orderBy(desc(submissions.createdAt));

    // Fetch joined journal rooms
    const joinedRooms = await db.select({
        id: conferences.id,
        name: conferences.name,
        theme: conferences.theme,
        roomKey: conferences.roomKey
    })
        .from(conferenceParticipants)
        .innerJoin(conferences, eq(conferenceParticipants.conferenceId, conferences.id))
        .where(eq(conferenceParticipants.userId, authorId));

    // For each submission, fetch completed reviews with feedback
    const submissionsWithReviews = await Promise.all(rawSubmissions.map(async (sub) => {
        const feedbackList = await db.select({
            feedback: reviews.feedback,
            decision: reviews.decision,
            date: reviews.completedAt
        })
            .from(reviews)
            .where(and(
                eq(reviews.submissionId, sub.id),
                isNotNull(reviews.completedAt)
            ));

        return { ...sub, feedbackList };
    }));

    return (
        <div className="space-y-16 text-left">
            <section className="space-y-8">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h2 className="text-2xl font-black text-navy uppercase tracking-tight flex items-center gap-3">
                        <Shield className="w-6 h-6 text-bright-blue" />
                        Journal Agendas
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {joinedRooms.map(room => (
                        <Link key={room.id} href={`/dashboard/rooms/${room.id}`}>
                            <Card className="p-6 bg-navy text-white hover:bg-black transition-all rounded-3xl border-none shadow-xl shadow-navy/20 h-full flex flex-col justify-between group">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-bright-blue uppercase tracking-[0.2em]">{room.roomKey}</span>
                                        <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-bright-blue group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <h3 className="text-xl font-black leading-tight">{room.name}</h3>
                                    <p className="text-xs text-white/50 font-bold line-clamp-1">{room.theme}</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-[10px] font-black uppercase text-bright-blue">
                                    <span className="w-1.5 h-1.5 rounded-full bg-bright-blue animate-pulse" />
                                    Joined & Active
                                </div>
                            </Card>
                        </Link>
                    ))}
                    <div className="md:col-span-2 lg:col-span-3">
                        <JoinConferenceRoom />
                    </div>
                </div>
            </section>

            <section className="space-y-8">
                <h2 className="text-2xl font-black text-navy uppercase tracking-tight">My Manuscripts</h2>

                {submissionsWithReviews.length === 0 ? (
                    <div className="p-12 text-center border-4 border-dashed border-slate-100 rounded-3xl bg-slate-50">
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">You haven't submitted any manuscripts yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {submissionsWithReviews.map(sub => (
                            <Card key={sub.id} className="p-8 bg-white border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-medium-blue/20 transition-all rounded-3xl overflow-hidden">
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="space-y-3 flex-1">
                                        <div className="flex items-center gap-4">
                                            <h3 className="font-black text-xl text-navy">{sub.title}</h3>
                                            <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest ${sub.status === 'revision_requested' ? 'bg-amber-100 text-amber-700' :
                                                sub.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                                                    sub.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                        'bg-medium-blue/10 text-medium-blue'
                                                }`}>
                                                {sub.status?.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <p className="text-slate-600 font-medium leading-relaxed line-clamp-2">{sub.abstract}</p>
                                        <div className="flex items-center gap-6 text-[10px] text-slate-400 font-black tracking-widest pt-2">
                                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-medium-blue" /> {sub.createdAt?.toLocaleDateString()}</span>
                                            <span className="bg-slate-100 px-2 py-0.5 rounded">ID: {sub.id}</span>
                                        </div>

                                        {sub.feedbackList && sub.feedbackList.length > 0 && (
                                            <div className="mt-6 p-6 bg-slate-50 rounded-2xl border border-slate-100 relative">
                                                <div className="flex items-center gap-2 text-navy mb-4 font-black uppercase text-xs tracking-widest">
                                                    <MessageSquare className="w-4 h-4 text-medium-blue" />
                                                    Reviewer Feedback
                                                </div>
                                                <div className="space-y-4">
                                                    {sub.feedbackList.map((f, i) => (
                                                        <div key={i} className="relative pl-6 border-l-2 border-medium-blue/20">
                                                            <Quote className="absolute -left-1.5 top-0 w-3 h-3 text-medium-blue opacity-50" />
                                                            <p className="text-slate-700 italic font-medium leading-relaxed text-sm">"{f.feedback}"</p>
                                                            <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-tighter">Decision: {f.decision} • {f.date?.toLocaleDateString()}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {sub.status === 'revision_requested' && (
                                        <div className="flex flex-col justify-start">
                                            <RevisionUpload submissionId={sub.id} />
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </section>

        </div>
    );
}
