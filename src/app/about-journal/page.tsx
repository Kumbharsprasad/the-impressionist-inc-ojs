'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/Card';
import { Shield, BookOpen, Clock, Globe, Award, Mail, Building, MapPin } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AboutJournalPage() {
    return (
        <div className="flex flex-col min-h-screen bg-light-gray">
            <Navbar />

            <main className="flex-grow pt-32 pb-24 px-4">
                <div className="max-w-5xl mx-auto space-y-16">
                    {/* Hero Section */}
                    <div className="text-center space-y-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-bright-blue/10 text-bright-blue font-black text-xs uppercase tracking-widest border border-bright-blue/20"
                        >
                            <BookOpen className="w-4 h-4" />
                            Official Publication
                        </motion.div>
                        <h1 className="text-4xl md:text-6xl font-black text-navy leading-tight">
                            The Impressionist Inc Journal of <br />
                            <span className="text-bright-blue text-5xl md:text-7xl">Security Studies (JSS)</span>
                        </h1>
                    </div>

                    {/* Content Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-8 text-left">
                            <Card className="bg-white p-10 rounded-[40px] border-2 border-slate-100 shadow-xl shadow-slate-200/50 space-y-8">
                                <section className="space-y-4">
                                    <h2 className="text-2xl font-black text-navy flex items-center gap-3">
                                        <Shield className="w-6 h-6 text-bright-blue" />
                                        Mission and Scope
                                    </h2>
                                    <p className="text-lg text-slate-700 leading-relaxed font-medium">
                                        The Impressionist Inc, MSRUAS, proudly launches the <span className="text-bright-blue font-black">The Impressionist Inc Journal of Security Studies (JSS)</span>.
                                        A double-blind peer-reviewed bi-annual journal dedicated to advancing discourse on traditional and non-traditional security challenges.
                                    </p>
                                </section>

                                <section className="space-y-4">
                                    <h2 className="text-2xl font-black text-navy flex items-center gap-3">
                                        <Award className="w-6 h-6 text-bright-blue" />
                                        Key Themes
                                    </h2>
                                    <p className="text-slate-600 leading-relaxed font-medium">
                                        The journal features diverse research contributions on pressing themes such as:
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                        {[
                                            "Climate-induced migration in South Asia",
                                            "India’s pursuit of strategic autonomy",
                                            "Manipur ethnic conflict",
                                            "China’s air-space counter-intervention",
                                            "India’s role in the QUAD",
                                            "AI and National Security"
                                        ].map((theme, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm font-bold text-navy bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                <div className="w-1.5 h-1.5 rounded-full bg-bright-blue" />
                                                {theme}
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <div className="p-6 bg-navy text-white rounded-3xl border-none shadow-lg">
                                    <p className="text-sm font-bold italic opacity-90 leading-relaxed">
                                        "Designed as a credible academic resource, the journal aims to shape scholarly debate and policy thinking in India and beyond."
                                    </p>
                                </div>
                            </Card>
                        </div>

                        {/* Sidebar / Stats */}
                        <div className="space-y-8">
                            {/* <Card className="bg-white p-8 rounded-[40px] border-2 border-slate-100 shadow-xl shadow-slate-200/50">
                                <h3 className="text-xl font-black text-navy mb-6 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-bright-blue" />
                                    Journal Details
                                </h3>
                                <div className="space-y-5">
                                    {[
                                        { label: "Starting Year", value: "July 2025" },
                                        { label: "Frequency", value: "Bi-Annual" },
                                        { label: "Format", value: "Online Version" },
                                        { label: "Subject", value: "Social Sciences" },
                                        { label: "Language", value: "English" },
                                    ].map((detail, i) => (
                                        <div key={i} className="flex flex-col border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{detail.label}</span>
                                            <span className="text-navy font-black text-lg">{detail.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card> */}

                            <Card className="bg-bright-blue p-8 rounded-[40px] text-white border-none shadow-2xl shadow-bright-blue/30">
                                <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-navy">
                                    <Mail className="w-5 h-5" />
                                    Publication Office
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <Building className="w-5 h-5 shrink-0 opacity-70" />
                                        <p className="text-sm font-bold leading-relaxed text-navy">
                                            The Impressionist Inc
                                        </p>
                                    </div>
                                    <div className="flex gap-4">
                                        <MapPin className="w-5 h-5 shrink-0 opacity-70" />
                                        <p className="text-xs font-medium leading-relaxed opacity-90 text-navy">
                                            Bengaluru – 560054
                                        </p>
                                    </div>
                                    <Link href="mailto:info@theimpressionistinc.com" className="flex items-center gap-3 bg-navy text-white p-4 rounded-2xl hover:bg-black transition-all">
                                        <Mail className="w-4 h-4" />
                                        <span className="text-xs font-black uppercase tracking-tighter">info@theimpressionistinc.com</span>
                                    </Link>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
