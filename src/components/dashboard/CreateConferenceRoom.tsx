'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card } from '@/components/ui/Card';
import { Plus, Users, Key, Copy, Check } from 'lucide-react';
import { createConferenceRoom } from '@/app/dashboard/actions';
import { toast } from 'sonner';

export default function CreateConferenceRoom() {
    const [isCreating, setIsCreating] = useState(false);
    const [roomKey, setRoomKey] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    async function handleSubmit(formData: FormData) {
        const res = await createConferenceRoom(formData);
        if (res.success && res.roomKey) {
            setRoomKey(res.roomKey);
            toast.success("Journal Room Created!");
        } else {
            toast.error(res.error || "Failed to create room");
        }
    }

    const copyToClipboard = () => {
        if (roomKey) {
            navigator.clipboard.writeText(roomKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (roomKey) {
        return (
            <Card className="p-10 bg-navy text-white rounded-[40px] border-none shadow-2xl animate-fade-in text-center space-y-6">
                <div className="w-20 h-20 bg-bright-blue/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-bright-blue/30">
                    <Key className="w-10 h-10 text-bright-blue" />
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tight">Room Created Successfully</h2>
                <p className="text-white/70 max-w-sm mx-auto">Share this unique key with Authors and Reviewers to invite them to your journal agenda.</p>

                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center justify-between gap-4 max-w-sm mx-auto group hover:border-bright-blue transition-all">
                    <span className="text-2xl font-black tracking-[0.2em] font-mono text-bright-blue">{roomKey}</span>
                    <Button variant="ghost" size="icon" onClick={copyToClipboard} className="text-white hover:bg-white/10">
                        {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                    </Button>
                </div>

                <Button onClick={() => setRoomKey(null)} variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-xl px-10">
                    Create Another Room
                </Button>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {!isCreating ? (
                <Button
                    onClick={() => setIsCreating(true)}
                    className="w-full h-24 bg-white border-4 border-dashed border-slate-100 hover:border-bright-blue/30 hover:bg-slate-50 text-slate-400 hover:text-bright-blue flex items-center justify-center gap-4 group transition-all rounded-[32px] overflow-hidden"
                >
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 group-hover:bg-bright-blue/10 flex items-center justify-center transition-colors">
                        <Plus className="w-6 h-6" />
                    </div>
                    <span className="text-xl font-black uppercase tracking-tight">Launch New Journal Agenda</span>
                </Button>
            ) : (
                <Card className="p-10 bg-white border-2 border-slate-100 rounded-[40px] shadow-sm animate-fade-in">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black text-navy uppercase tracking-tight flex items-center gap-3">
                            <Plus className="w-6 h-6 text-bright-blue" />
                            Special Journal Room
                        </h2>
                        <Button variant="ghost" onClick={() => setIsCreating(false)} className="text-slate-400 font-bold hover:text-red-500">Cancel</Button>
                    </div>

                    <form action={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-navy uppercase tracking-widest ml-1">Journal Name</label>
                                <Input name="name" placeholder="e.g. The Impressionist Inc Journal of Security Studies Vol. 1" required className="bg-slate-50 border-slate-200 focus:border-bright-blue rounded-xl h-12" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-navy uppercase tracking-widest ml-1">Main Theme</label>
                                <Input name="theme" placeholder="e.g. Traditional vs Non-Traditional Challenges" required className="bg-slate-50 border-slate-200 focus:border-bright-blue rounded-xl h-12" />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-black text-navy uppercase tracking-widest ml-1">Agenda Details</label>
                                <Textarea name="agenda" placeholder="Detail the agenda, speakers, and focus areas..." className="min-h-[120px] bg-slate-50 border-slate-200 focus:border-bright-blue rounded-2xl p-4" required />
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button type="submit" className="w-full h-14 bg-bright-blue hover:bg-navy text-white rounded-2xl font-black text-lg shadow-xl shadow-bright-blue/20 flex items-center justify-center gap-3 uppercase tracking-tight">
                                <Users className="w-5 h-5" />
                                Initialize Room & Generate Invitations
                            </Button>
                        </div>
                    </form>
                </Card>
            )}
        </div>
    );
}
