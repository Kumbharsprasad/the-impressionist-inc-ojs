import { db } from '@/db/index';
import { conferences, users, conferenceParticipants } from '@/db/schema';
import { eq, count } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Shield, Users, ArrowRight, LayoutGrid, KeyRound, Calendar } from 'lucide-react';
import Link from 'next/link';
import CreateConferenceRoom from '@/components/dashboard/CreateConferenceRoom';

export default async function EditorRoomsPage() {
    const session = await getSession();
    if (!session || session.user.role !== 'editor') redirect('/login');

    // Fetch all rooms created by this editor
    const myRooms = await db.select({
        id: conferences.id,
        name: conferences.name,
        theme: conferences.theme,
        roomKey: conferences.roomKey,
        createdAt: conferences.createdAt,
    })
        .from(conferences)
        .where(eq(conferences.editorId, session.user.id))
        .orderBy(conferences.createdAt);

    // Fetch participant counts for each room
    const roomsWithCounts = await Promise.all(myRooms.map(async (room) => {
        const participants = await db.select({
            count: count()
        })
            .from(conferenceParticipants)
            .where(eq(conferenceParticipants.conferenceId, room.id));

        return { ...room, participantCount: participants[0].count };
    }));

    return (
        <div className="space-y-12 pb-20 text-left">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 pb-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-navy uppercase tracking-tight">Journal Command Center</h1>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
                        <Shield className="w-4 h-4 text-bright-blue" />
                        Manage your active research agendas
                    </p>
                </div>
                <div className="bg-navy px-6 py-3 rounded-2xl text-white font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-navy/20">
                    <LayoutGrid className="w-4 h-4 text-bright-blue" />
                    {myRooms.length} Active Rooms
                </div>
            </div>

            <section className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-6 h-6 text-bright-blue" />
                    <h2 className="text-xl font-black text-navy uppercase tracking-widest">Agenda Initialization</h2>
                </div>
                <CreateConferenceRoom />
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {roomsWithCounts.length === 0 ? (
                    <div className="md:col-span-2 lg:col-span-3 py-20 bg-slate-50 border-4 border-dashed border-slate-100 rounded-[40px] text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                        No journal rooms initialized yet.
                    </div>
                ) : (
                    roomsWithCounts.map((room) => (
                        <Card key={room.id} className="p-8 bg-white border-2 border-slate-100 rounded-[40px] hover:shadow-2xl hover:border-bright-blue/20 transition-all group relative overflow-hidden flex flex-col justify-between h-full">
                            <div className="space-y-6">
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-12 bg-navy rounded-2xl flex items-center justify-center shadow-lg shadow-navy/20">
                                        <Shield className="w-6 h-6 text-bright-blue" />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            <KeyRound className="w-3 h-3 text-bright-blue" />
                                            {room.roomKey}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-xl font-black text-navy leading-tight uppercase group-hover:text-bright-blue transition-colors">
                                        {room.name}
                                    </h3>
                                    <p className="text-xs text-slate-500 font-bold line-clamp-2 uppercase tracking-tight opacity-70">
                                        {room.theme}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                                    <div className="flex items-center gap-1.5 text-navy font-black text-[10px] uppercase">
                                        <Users className="w-4 h-4 text-bright-blue" />
                                        {room.participantCount} Experts Joined
                                    </div>
                                    <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase ml-auto">
                                        <Calendar className="w-4 h-4 text-slate-200" />
                                        {new Date(room.createdAt!).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            <Link href={`/dashboard/rooms/${room.id}`} className="mt-8">
                                <Button className="w-full h-12 rounded-2xl bg-slate-50 hover:bg-navy hover:text-white text-navy font-black uppercase text-[10px] tracking-widest border border-slate-100 hover:border-navy transition-all flex items-center justify-center gap-2 group/btn">
                                    Manage Command
                                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
