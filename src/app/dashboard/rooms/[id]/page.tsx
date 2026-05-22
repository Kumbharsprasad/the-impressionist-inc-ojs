import { db } from '@/db/index';
import { conferences, submissions, users, conferenceParticipants } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Shield, BookOpen, Users, Calendar, FileText, User as UserIcon, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import NewSubmissionForm from '@/components/dashboard/NewSubmissionForm';

export default async function ConferenceRoomPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const session = await getSession();
    if (!session) redirect('/login');

    const { id } = await params;
    const conferenceId = parseInt(id);

    // 1. Fetch conference details
    const room = await db.select().from(conferences).where(eq(conferences.id, conferenceId)).limit(1);
    if (room.length === 0) notFound();

    // 2. Check if user has access (is participant or the editor who created it)
    const isOwner = room[0].editorId === session.user.id;
    const participant = await db.select().from(conferenceParticipants)
        .where(and(
            eq(conferenceParticipants.conferenceId, conferenceId),
            eq(conferenceParticipants.userId, session.user.id)
        )).limit(1);

    if (!isOwner && participant.length === 0) {
        redirect('/dashboard'); // Unauthorized or not joined
    }

    // 3. Fetch all participants in this room for the editor view
    let allParticipants: any[] = [];
    if (isOwner) {
        allParticipants = await db.select({
            id: users.id,
            name: users.name,
            role: users.role,
            email: users.email
        })
            .from(conferenceParticipants)
            .innerJoin(users, eq(conferenceParticipants.userId, users.id))
            .where(eq(conferenceParticipants.conferenceId, conferenceId));
    }

    // 4. Fetch papers in this room (Authors only see their own, Editor sees all)
    const submissionsFilter = session.user.role === 'author'
        ? and(eq(submissions.conferenceId, conferenceId), eq(submissions.authorId, session.user.id))
        : eq(submissions.conferenceId, conferenceId);

    const roomSubmissions = await db.select({
        id: submissions.id,
        title: submissions.title,
        abstract: submissions.abstract,
        author: users.name,
        status: submissions.status,
        createdAt: submissions.createdAt
    })
        .from(submissions)
        .leftJoin(users, eq(submissions.authorId, users.id))
        .where(submissionsFilter)
        .orderBy(desc(submissions.createdAt));

    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div className="space-y-6">
                <Link href={session.user.role === 'editor' ? "/dashboard/rooms" : "/dashboard"} className="inline-flex items-center gap-2 text-slate-400 hover:text-navy font-black uppercase text-xs tracking-widest transition-colors mb-4">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Command Center
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                    <div className="space-y-4 text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bright-blue/10 text-bright-blue font-black text-[10px] uppercase tracking-widest border border-bright-blue/20">
                            <Shield className="w-4 h-4" />
                            Active Journal Room
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-navy uppercase tracking-tight leading-tight">{room[0].name}</h1>
                        <p className="text-xl text-slate-500 font-bold border-l-4 border-slate-200 pl-6">{room[0].theme}</p>
                    </div>

                    <Card className="bg-navy p-6 w-full md:w-64 text-white rounded-3xl border-none shadow-xl shadow-navy/20 space-y-4">
                        <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                            <Users className="w-5 h-5 text-bright-blue" />
                            <span className="text-navy/100 font-black uppercase">Room Key</span>
                        </div>
                        <div className="text-2xl font-black font-mono tracking-widest text-bright-blue text-center">{room[0].roomKey}</div>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content: Papers */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <h2 className="text-2xl font-black text-navy uppercase tracking-tight flex items-center gap-3">
                            <BookOpen className="w-6 h-6 text-bright-blue" />
                            Submissions in Room
                        </h2>
                        <span className="text-xs font-black text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase">{roomSubmissions.length} Papers</span>
                    </div>

                    {roomSubmissions.length === 0 ? (
                        <div className="py-20 bg-slate-50 border-4 border-dashed border-slate-100 rounded-[40px] text-center">
                            <FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                            <p className="text-slate-400 font-bold uppercase tracking-widest">No papers submitted to this room yet.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {roomSubmissions.map(sub => (
                                <Card key={sub.id} className="p-8 bg-white border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-bright-blue/20 transition-all rounded-[32px] overflow-hidden">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-xl font-black text-navy leading-tight">{sub.title}</h3>
                                            <span className="text-[10px] px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-black uppercase tracking-widest">{sub.status?.replace('_', ' ')}</span>
                                        </div>
                                        <p className="text-slate-600 font-medium leading-relaxed line-clamp-2">{sub.abstract}</p>
                                        <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400 pt-2">
                                            <span className="flex items-center gap-1.5"><UserIcon className="w-3.5 h-3.5 text-bright-blue" /> by {sub.author}</span>
                                            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-bright-blue" /> {sub.createdAt?.toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar: Agenda & Submission for Authors */}
                <div className="space-y-8">
                    {/* Participant List (Visible to Editor Only) */}
                    {isOwner && allParticipants.length > 0 && (
                        <Card className="p-8 bg-slate-50 border-2 border-slate-100 rounded-[40px] shadow-sm space-y-6">
                            <h3 className="text-xl font-black text-navy uppercase tracking-tight flex items-center gap-2">
                                <Users className="w-5 h-5 text-bright-blue" />
                                Expert Command
                            </h3>
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {allParticipants.map((p) => (
                                    <div key={p.id} className="p-4 bg-white rounded-2xl border border-slate-100 flex flex-col gap-1 shadow-sm">
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm font-black text-navy uppercase tracking-tight">{p.name}</p>
                                            <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${p.role === 'reviewer' ? 'bg-amber-100 text-amber-700' : 'bg-bright-blue/10 text-bright-blue'
                                                }`}>
                                                {p.role}
                                            </span>
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-400 truncate">{p.email}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    <Card className="p-8 bg-white border-2 border-slate-100 rounded-[40px] shadow-sm space-y-6">
                        <h3 className="text-xl font-black text-navy uppercase tracking-tight">Agenda</h3>
                        <div className="prose prose-slate text-sm font-medium text-slate-600 leading-relaxed whitespace-pre-wrap">
                            {room[0].agenda}
                        </div>
                    </Card>

                    {session.user.role === 'author' && (
                        <Card className="p-8 bg-bright-blue text-white rounded-[40px] border-none shadow-xl shadow-bright-blue/20 space-y-6">
                            <h3 className="text-navy font-black uppercase tracking-tight">Submit to this Room</h3>
                            <p className="text-sm font-bold text-navy/100">Submit your research specifically for this journal agenda.</p>
                            <Link href={`/dashboard/rooms/${conferenceId}/submit`}>
                                <Button className="w-full h-14 bg-navy hover:bg-black text-white rounded-2xl font-black uppercase tracking-widest shadow-lg">
                                    Submit Paper
                                </Button>
                            </Link>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
