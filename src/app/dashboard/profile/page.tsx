import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Shield, User, Mail, ShieldCheck, Calendar, Hash } from 'lucide-react';

export default async function ProfilePage() {
    const session = await getSession();
    if (!session) redirect('/login');

    const user = session.user;

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20 text-left">
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bright-blue/10 text-bright-blue font-black text-[10px] uppercase tracking-widest border border-bright-blue/20">
                    <Shield className="w-4 h-4" />
                    Member Profile
                </div>
                <h1 className="text-4xl font-black text-navy uppercase tracking-tight">
                    Intelligence <span className="text-bright-blue">Credentials</span>
                </h1>
                <p className="text-lg text-slate-500 font-bold uppercase tracking-tight opacity-70">Secured Personnel Data</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Avatar Card */}
                <Card className="md:col-span-1 p-10 bg-navy text-white rounded-[40px] border-none shadow-2xl flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-24 h-24 bg-bright-blue/20 rounded-full flex items-center justify-center border-4 border-bright-blue/30 shadow-xl shadow-bright-blue/10">
                        <User className="w-12 h-12 text-bright-blue" />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-xl font-black uppercase tracking-tight">{user.name}</h2>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-bright-blue text-[9px] font-black uppercase tracking-widest border border-white/5">
                            {user.role} Member
                        </div>
                    </div>
                </Card>

                {/* Details Card */}
                <Card className="md:col-span-2 p-10 bg-white border-2 border-slate-100 rounded-[40px] shadow-sm space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <User className="w-3 h-3 text-bright-blue" />
                                Legal Identity
                            </label>
                            <p className="text-navy font-black text-lg">{user.name}</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Mail className="w-3 h-3 text-bright-blue" />
                                Communication Node
                            </label>
                            <p className="text-navy font-black text-lg">{user.email}</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <ShieldCheck className="w-3 h-3 text-bright-blue" />
                                Clearance Role
                            </label>
                            <p className="text-navy font-black text-lg uppercase">{user.role}</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Hash className="w-3 h-3 text-bright-blue" />
                                Internal ID
                            </label>
                            <p className="text-navy font-black text-lg tracking-widest">USER-{user.id.toString().padStart(4, '0')}</p>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-50">
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
                            <Calendar className="w-10 h-10 text-slate-200" />
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                                <p className="text-sm font-black text-emerald-500 uppercase tracking-tight flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    Active Credentials Verified
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Background Decorative */}
            <div className="flex items-center justify-center gap-6 opacity-5 grayscale pt-10">
                <Shield className="w-12 h-12" />
                <div className="text-[20px] font-black uppercase tracking-[0.5em]">The Impressionist Inc Secure Access</div>
            </div>
        </div>
    );
}
