'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { forgotPasswordAction } from '@/app/auth-actions';
import { Mail, Shield, ArrowRight, Loader2, KeyRound, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';

export default function ForgotPasswordPage() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError('');
        try {
            const result = await forgotPasswordAction(formData);
            if (result && result.error) {
                setError(result.error);
                setLoading(false);
            } else if (result?.success) {
                setIsSent(true);
                setLoading(false);
            }
        } catch (e) {
            setError('An unexpected error occurred. Please try again later.');
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-light-gray relative overflow-hidden">
            <main className="flex-grow flex items-center justify-center p-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-[480px]"
                >
                    <AnimatePresence mode="wait">
                        {!isSent ? (
                            <motion.div
                                key="request"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className="bg-white p-10 md:p-14 rounded-[40px] border-2 border-slate-100 shadow-2xl shadow-slate-200/50 space-y-10 text-left">
                                    <div className="space-y-4">
                                        <div className="w-16 h-16 bg-navy rounded-2xl flex items-center justify-center shadow-lg shadow-navy/20">
                                            <KeyRound className="w-8 h-8 text-bright-blue" />
                                        </div>
                                        <div className="space-y-1">
                                            <h1 className="text-3xl font-black text-navy uppercase tracking-tight leading-tight">Access Recovery</h1>
                                            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Verify Email to Reset Credentials</p>
                                        </div>
                                    </div>

                                    <form action={handleSubmit} className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-navy uppercase tracking-widest ml-1">Registered Institutional Email</label>
                                                <div className="relative group">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-bright-blue transition-colors" />
                                                    <Input
                                                        name="email"
                                                        type="email"
                                                        placeholder="name@institution.ac.in"
                                                        className="pl-12 h-14 bg-slate-50 border-slate-200 focus:border-bright-blue rounded-2xl font-bold transition-all"
                                                        required
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

                                        <Button
                                            type="submit"
                                            className="w-full h-16 bg-bright-blue hover:bg-navy text-white rounded-3xl font-black text-lg shadow-xl shadow-bright-blue/20 flex items-center justify-center gap-3 active:scale-95 transition-all uppercase tracking-tight border-none"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Searching Records...
                                                </>
                                            ) : (
                                                <>
                                                    Request Reset Link
                                                    <ArrowRight className="w-5 h-5" />
                                                </>
                                            )}
                                        </Button>

                                        <div className="text-center pt-4">
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                                                Remembered it? <Link href="/login" className="text-bright-blue hover:underline">Back to Login</Link>
                                            </p>
                                        </div>
                                    </form>
                                </Card>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Card className="bg-white p-14 rounded-[40px] border-2 border-slate-100 shadow-2xl shadow-slate-200/50 space-y-8 text-center">
                                    <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 mx-auto">
                                        <CheckCircle2 className="w-10 h-10 text-white" />
                                    </div>
                                    <div className="space-y-3">
                                        <h2 className="text-3xl font-black text-navy uppercase tracking-tight">Recovery Initialized</h2>
                                        <p className="text-sm text-slate-500 font-bold leading-relaxed px-4">
                                            If an account exists for that email, you will receive a recovery link shortly. <br />
                                            <span className="text-slate-400 text-xs">Check your institutional inbox.</span>
                                        </p>
                                    </div>
                                    <Link href="/login" className="block w-full">
                                        <Button className="w-full h-14 bg-navy hover:bg-black text-white rounded-2xl font-black uppercase text-xs tracking-widest">
                                            Return to Portal
                                        </Button>
                                    </Link>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-8 flex items-center justify-center gap-6 opacity-30 grayscale">
                        <Shield className="w-5 h-5" />
                        <div className="text-[10px] font-black uppercase tracking-[0.3em]">Encrypted Recovery Secure</div>
                    </div>
                </motion.div>
            </main>

            {/* Decorative Blurs */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-bright-blue/5 blur-[120px] rounded-full -z-10" />
            <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-navy/5 blur-[100px] rounded-full -z-10" />
        </div>
    );
}
