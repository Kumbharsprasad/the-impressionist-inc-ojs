'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { register } from '@/app/auth-actions';
import { User, Mail, Lock, Shield, ArrowRight, Loader2, Globe, PenTool, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { motion } from 'framer-motion';

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError('');
        try {
            const result = await register(formData);
            // register() redirects on success, which throws a NEXT_REDIRECT error caught by the framework.
            // If it returns, it's usually an error object.
            if (result && result.error) {
                setError(result.error);
                setLoading(false);
            }
        } catch (e: any) {
            // Check if it's a redirect error (Next.js internals)
            if (e.message !== 'NEXT_REDIRECT') {
                setError('Registration failed. Please try again.');
                setLoading(false);
            }
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-light-gray relative overflow-hidden">
            <main className="flex-grow flex items-center justify-center p-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-[560px]"
                >
                    <Card className="bg-white p-10 md:p-14 rounded-[40px] border-2 border-slate-100 shadow-2xl shadow-slate-200/50 space-y-10 text-left">
                        <div className="space-y-4">
                            <div className="w-16 h-16 bg-bright-blue rounded-2xl flex items-center justify-center shadow-lg shadow-bright-blue/20">
                                <User className="w-8 h-8 text-white" />
                            </div>
                            <div className="space-y-1">
                                <h1 className="text-3xl font-black text-navy uppercase tracking-tight leading-tight">Join the Network</h1>
                                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Register for Research Community</p>
                            </div>
                        </div>

                        <form action={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-navy uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Shield className="w-3 h-3" />
                                        Designated Role
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="role"
                                            className="w-full h-14 bg-slate-50 border-2 border-slate-100 text-navy font-bold rounded-2xl px-4 appearance-none focus:outline-none focus:border-bright-blue transition-all cursor-pointer"
                                            defaultValue="author"
                                        >
                                            <option value="author">Member Author</option>
                                            <option value="reviewer">Expert Reviewer</option>
                                            <option value="editor">Executive Editor</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <ArrowRight className="w-4 h-4 rotate-90" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-navy uppercase tracking-widest ml-1">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-bright-blue transition-colors" />
                                        <Input
                                            name="name"
                                            placeholder="Research Identity"
                                            className="pl-12 h-14 bg-slate-50 border-slate-200 focus:border-bright-blue rounded-2xl font-bold transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-navy uppercase tracking-widest ml-1">Email</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-bright-blue transition-colors" />
                                        <Input
                                            name="email"
                                            type="email"
                                            placeholder="abc@mail.com"
                                            className="pl-12 h-14 bg-slate-50 border-slate-200 focus:border-bright-blue rounded-2xl font-bold transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-navy uppercase tracking-widest ml-1">Secure Passphrase</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-bright-blue transition-colors" />
                                        <Input
                                            name="password"
                                            type="password"
                                            placeholder="Minimum 6 characters"
                                            className="pl-12 h-14 bg-slate-50 border-slate-200 focus:border-bright-blue rounded-2xl font-bold transition-all"
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-red-500 text-xs font-black uppercase tracking-tighter bg-red-50 p-4 rounded-xl border border-red-100 flex items-center gap-2"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                    {error}
                                </motion.div>
                            )}

                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    className="w-full h-16 bg-bright-blue hover:bg-navy text-white rounded-3xl font-black text-lg shadow-xl shadow-bright-blue/20 flex items-center justify-center gap-3 active:scale-95 transition-all uppercase tracking-tight border-none"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Initializing Identity...
                                        </>
                                    ) : (
                                        <>
                                            Create Account
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </Button>
                            </div>

                            <div className="text-center">
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                                    Member already? <Link href="/login" className="text-bright-blue hover:underline">Activate Session</Link>
                                </p>
                            </div>
                        </form>
                    </Card>

                    <div className="mt-8 flex items-center justify-center gap-8 opacity-40 grayscale">
                        <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Global Outreach</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <PenTool className="w-4 h-4" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Peer Review</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <LayoutDashboard className="w-4 h-4" />
                            <span className="text-[9px] font-black uppercase tracking-widest">SaaS Analytics</span>
                        </div>
                    </div>
                </motion.div>
            </main>

            {/* Decorative Blurs */}
            <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-navy/5 blur-[120px] rounded-full -z-10" />
            <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-bright-blue/10 blur-[100px] rounded-full -z-10" />
        </div>
    );
}
