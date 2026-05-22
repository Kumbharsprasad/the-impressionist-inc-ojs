import { db } from '@/db/index';
import { conferences } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import NewSubmissionForm from '@/components/dashboard/NewSubmissionForm';
import { Card } from '@/components/ui/Card';
import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function RoomSubmissionPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const session = await getSession();
    if (!session || session.user.role !== 'author') redirect('/login');

    const { id } = await params;
    const conferenceId = parseInt(id);
    const room = await db.select().from(conferences).where(eq(conferences.id, conferenceId)).limit(1);
    if (room.length === 0) notFound();

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20 text-left">
            <Link href={`/dashboard/rooms/${conferenceId}`} className="inline-flex items-center gap-2 text-slate-400 hover:text-navy font-black uppercase text-xs tracking-widest transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Room
            </Link>

            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bright-blue/10 text-bright-blue font-black text-[10px] uppercase tracking-widest border border-bright-blue/20">
                    <Shield className="w-4 h-4" />
                    Special Agenda Submission
                </div>
                <h1 className="text-4xl font-black text-navy uppercase tracking-tight">
                    Submit Manuscript to <br />
                    <span className="text-bright-blue">{room[0].name}</span>
                </h1>
                <p className="text-lg text-slate-500 font-bold">{room[0].theme}</p>
            </div>

            <Card className="bg-white p-10 rounded-[40px] border-2 border-slate-100 shadow-xl shadow-slate-200/50">
                <form action="/dashboard/actions/createSubmission" method="POST">
                    {/* We need to update NewSubmissionForm to accept the prop or just build a quick wrapper here */}
                    {/* Since NewSubmissionForm is client-side, let's create a specialized one or modify the existing one to accept a prop */}
                    <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl mb-8">
                        <p className="text-sm font-bold text-amber-700">
                            You are submitting this paper specifically to the journal room above. It will be visible to the room moderators and reviewers.
                        </p>
                    </div>
                </form>
                {/* Note: I'll update NewSubmissionForm to accept roomContext prop */}
                <NewSubmissionForm conferenceId={conferenceId} />
            </Card>
        </div>
    );
}
