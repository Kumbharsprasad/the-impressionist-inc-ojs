'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { LogIn, Hash, Loader2 } from 'lucide-react';
import { joinConferenceRoom } from '@/app/dashboard/actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function JoinConferenceRoom() {
    const [key, setKey] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleJoin() {
        if (!key) return;
        setLoading(true);
        try {
            const res = await joinConferenceRoom(key);
            if (res.success) {
                toast.success("Joined Journal Room!");
                router.push(`/dashboard/rooms/${res.conferenceId}`);
            } else {
                toast.error(res.error || "Failed to join");
            }
        } catch (e) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="p-8 bg-white border-2 border-slate-100 rounded-[40px] shadow-sm overflow-hidden relative">
            <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-16 h-16 rounded-3xl bg-bright-blue/10 flex items-center justify-center shrink-0">
                    <Hash className="w-8 h-8 text-bright-blue" />
                </div>

                <div className="flex-1 text-left space-y-1">
                    <h3 className="text-xl font-black text-navy uppercase tracking-tight">Access Journal Room</h3>
                    <p className="text-sm text-slate-500 font-medium">Enter your invitation key to join a special journal agenda.</p>
                </div>

                <div className="flex w-full md:w-auto items-center gap-2">
                    <Input
                        placeholder="ABC-123"
                        value={key}
                        onChange={(e) => setKey(e.target.value.toUpperCase())}
                        className="h-14 font-mono font-black text-center tracking-[0.2em] uppercase border-2 focus:border-bright-blue rounded-2xl w-36"
                    />
                    <Button
                        disabled={loading || key.length < 5}
                        onClick={handleJoin}
                        className="h-14 bg-navy hover:bg-black text-white px-8 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-navy/10 transition-all font-xs uppercase tracking-widest disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                        Join
                    </Button>
                </div>
            </div>

            {/* Background design */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full translate-x-16 -translate-y-16 -z-10" />
        </Card>
    );
}
