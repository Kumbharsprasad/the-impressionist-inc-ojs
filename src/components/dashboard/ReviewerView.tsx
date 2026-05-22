import { db } from '@/db/index';
import { submissions, reviews, conferences, conferenceParticipants } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { FileText, ArrowRight, Shield } from 'lucide-react';
import JoinConferenceRoom from './JoinConferenceRoom';

export default async function ReviewerView({ reviewerId }: { reviewerId: number }) {
    const myReviews = await db.select({
        id: reviews.id,
        submissionId: submissions.id,
        title: submissions.title,
        abstract: submissions.abstract,
        status: reviews.decision, // current decision if any
        pdfUrl: submissions.pdfUrl,
        submissionStatus: submissions.status,
    })
        .from(reviews)
        .leftJoin(submissions, eq(reviews.submissionId, submissions.id))
        .where(eq(reviews.reviewerId, reviewerId));

    // Fetch joined journal rooms
    const joinedRooms = await db.select({
        id: conferences.id,
        name: conferences.name,
        theme: conferences.theme,
        roomKey: conferences.roomKey
    })
        .from(conferenceParticipants)
        .innerJoin(conferences, eq(conferenceParticipants.conferenceId, conferences.id))
        .where(eq(conferenceParticipants.userId, reviewerId));

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
                                    Active Room
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
                <h1 className="text-3xl font-black text-navy uppercase tracking-tight">Review Assignments</h1>

                {myReviews.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 border-4 border-dashed border-slate-100 rounded-3xl text-slate-400 font-bold">
                        No papers assigned for review yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {myReviews.map((rev) => (
                            <Card key={rev.id} className="flex flex-col h-full bg-white border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-medium-blue/20 transition-all rounded-3xl p-8">
                                <div className="flex-1 space-y-5">
                                    <div className="flex justify-between items-start">
                                        <div className="p-3 bg-medium-blue/10 rounded-2xl">
                                            <FileText className="w-8 h-8 text-medium-blue" />
                                        </div>
                                        {rev.status ? (
                                            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Completed</span>
                                        ) : (
                                            <span className="text-[10px] font-black text-navy uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full border border-slate-200">Pending</span>
                                        )}
                                    </div>

                                    <h3 className="font-black text-xl text-navy line-clamp-2 leading-tight" title={rev.title!}>{rev.title}</h3>
                                    <p className="text-slate-600 font-medium text-sm line-clamp-3 leading-relaxed">{rev.abstract}</p>
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-50">
                                    <Link href={`/dashboard/reviews/${rev.id}`} className="block">
                                        <Button className="w-full h-12 rounded-xl text-sm font-black border-2 border-slate-100 hover:border-medium-blue/30 text-navy" variant="outline" size="md">
                                            {rev.status ? 'View Decision' : 'Start Review'}
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
