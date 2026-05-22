"use client";

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/Card';
import { Shield, Target, Rocket, GraduationCap, Building2, MapPin, Mail, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AboutTheImpressionistIncPage() {
    return (
        <div className="flex flex-col min-h-screen bg-light-gray">
            <Navbar />

            <main className="flex-grow pt-32 pb-24 px-4">
                <div className="max-w-5xl mx-auto space-y-16">
                    {/* Hero Section */}
                    <div className="text-center space-y-6">
                        {/* <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-bright-blue/10 text-bright-blue font-black text-xs uppercase tracking-widest border border-bright-blue/20"
                        >
                            <Shield className="w-4 h-4" />
                            Centre of Excellence
                        </motion.div> */}
                        <h1 className="text-4xl md:text-6xl font-black text-navy leading-tight">
                            Centre of Excellence<br/>
                            {/* <span className="text-bright-blue text-5xl md:text-7xl">National Security Studies</span> */}
                        </h1>
                    </div>

                    {/* Content Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-8 text-left">
                            <Card className="bg-white p-10 rounded-[40px] border-2 border-slate-100 shadow-xl shadow-slate-200/50 space-y-10">
                                <section className="space-y-4">
                                    <h2 className="text-2xl font-black text-navy flex items-center gap-3 underline decoration-bright-blue/30 decoration-4 underline-offset-8">
                                        <GraduationCap className="w-6 h-6 text-bright-blue" />
                                        Our Foundation
                                    </h2>
                                    <p className="text-lg text-slate-700 leading-relaxed font-medium pt-4">
                                        The Impressionist Inc is an independent multidisciplinary institute focused on research, creative practice, and public engagement. We bring together scholars, artists, and practitioners to explore how culture, technology, and policy intersect and shape contemporary life.
                                    </p>
                                    <p className="text-slate-600 leading-relaxed font-medium">
                                        Through research projects, exhibitions, workshops, and publications, The Impressionist Inc fosters critical inquiry and collaborative innovation. We support fellows, host public programs, and partner with universities and organizations to translate ideas into real-world impact.
                                    </p>
                                </section>

                                <section className="space-y-6">
                                    <h2 className="text-2xl font-black text-navy flex items-center gap-3 underline decoration-bright-blue/30 decoration-4 underline-offset-8">
                                        <Target className="w-6 h-6 text-bright-blue" />
                                        Vision
                                    </h2>
                                    <div className="p-8 bg-navy text-white rounded-3xl border-none shadow-lg relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
                                            <Target className="w-20 h-20" />
                                        </div>
                                        <p className="text-lg font-bold italic leading-relaxed relative z-10">
                                            "Establish a leading Centre of Excellence for Applied Research & Security Studies to help create competitive knowledge in all elements of Comprehensive National Security."
                                        </p>
                                    </div>
                                </section>

                                <section className="space-y-6">
                                    <h2 className="text-2xl font-black text-navy flex items-center gap-3 underline decoration-bright-blue/30 decoration-4 underline-offset-8">
                                        <Rocket className="w-6 h-6 text-bright-blue" />
                                        Mission
                                    </h2>
                                    <div className="grid gap-6">
                                        <div className="flex gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-bright-blue/20 transition-all">
                                            <div className="w-8 h-8 rounded-full bg-bright-blue/10 flex items-center justify-center shrink-0">
                                                <span className="text-bright-blue font-black">01</span>
                                            </div>
                                            <p className="text-slate-700 font-medium leading-relaxed">
                                                Establish Academic and Applied Research Programmes in areas of national security thought leadership and emerging and deep technologies.
                                            </p>
                                        </div>
                                        <div className="flex gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-bright-blue/20 transition-all">
                                            <div className="w-8 h-8 rounded-full bg-bright-blue/10 flex items-center justify-center shrink-0">
                                                <span className="text-bright-blue font-black">02</span>
                                            </div>
                                            <p className="text-slate-700 font-medium leading-relaxed">
                                                Play a lead role in the developing and advocacy of policies in collaboration with reputed think tanks and universities of national and international repute.
                                            </p>
                                        </div>
                                    </div>
                                </section>
                            </Card>
                        </div>

                        {/* Sidebar / Context */}
                        <div className="space-y-8">
                            {/* <Card className="bg-white p-8 rounded-[40px] border-2 border-slate-100 shadow-xl shadow-slate-200/50">
                                <h3 className="text-xl font-black text-navy mb-6 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-bright-blue" />
                                    Timeline
                                </h3>
                                <div className="space-y-5">
                                    {[
                                        { label: "Founded", value: "July 2023" },
                                        { label: "MoU Partner 1", value: "MSRUAS" },
                                        { label: "MoU Partner 2", value: "ARTRAC" },
                                        { label: "Status", value: "Active CoE" },
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
                                    <Building2 className="w-5 h-5 shrink-0" />
                                    Institution
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <MapPin className="w-5 h-5 shrink-0 opacity-70 text-navy" />
                                        <p className="text-xs font-medium leading-relaxed text-navy">
                                            Bengaluru – 560054
                                        </p>
                                    </div>
                                    <Link href="mailto:info@theimpressionistinc.com" className="flex items-center gap-3 bg-navy text-white p-4 rounded-2xl hover:bg-black transition-all">
                                        <Mail className="w-4 h-4" />
                                        <span className="text-xs font-black uppercase tracking-tighter">Email The Impressionist Inc</span>
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
