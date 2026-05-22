'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ArrowRight, BookOpen, PenTool, LayoutDashboard, Globe, Shield, ScrollText } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow flex flex-col items-center relative overflow-x-hidden bg-light-gray text-navy pt-32 pb-24">
        <Navbar />

        <div className="z-10 max-w-5xl w-full text-center space-y-12 animate-fade-in px-4">
            <div className="space-y-4">
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bright-blue/10 text-bright-blue font-bold text-sm border border-bright-blue/20"
            >
              <Shield className="w-4 h-4" />
              National Security Intelligence
            </motion.div> */}

            <h1 className="text-5xl md:text-8xl font-black tracking-tight text-navy mb-2 leading-[0.9]">
              THE<br />
              <span className="text-bright-blue">IMPRESSIONIST</span> <br />
              INC
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
            Leading the discourse in global strategy and security management.
            A premier platform for peer-reviewed academic excellence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
            <Link href="/login" className="w-full sm:w-auto">
              <Button className="w-full sm:px-12 h-16 text-xl bg-bright-blue hover:bg-medium-blue text-white rounded-2xl shadow-xl shadow-bright-blue/20 border-none transition-all hover:scale-105 active:scale-95">
                Access Portal
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
            </Link>

            <Link href="/register" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:px-12 h-16 text-xl border-2 border-navy text-navy hover:bg-navy hover:text-white rounded-2xl transition-all font-bold">
                Join as Member
              </Button>
            </Link>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 text-left">
            <motion.div whileHover={{ y: -10 }} className="h-full">
              <Card className="bg-white border-2 border-slate-200 p-8 h-full shadow-sm hover:shadow-xl hover:border-bright-blue/30 transition-all rounded-3xl">
                <ScrollText className="w-12 h-12 text-bright-blue mb-6" />
                <h3 className="text-2xl font-black text-navy mb-4">Scholarly Submissions</h3>
                <p className="text-slate-600 font-medium leading-relaxed">Submit your research with our streamlined peer-review system designed for international standards.</p>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="h-full">
              <Card className="bg-navy p-8 h-full shadow-2xl shadow-navy/20 text-white rounded-3xl border-none">
                <Globe className="w-12 h-12 text-bright-blue mb-6" />
                <h3 className="text-2xl font-black text-navy mb-4">Global Network</h3>
                <p className="text-slate-600 font-medium leading-relaxed">Connect with leading security researchers and policy makers through our integrated dashboard.</p>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="h-full">
              <Card className="bg-white border-2 border-slate-200 p-8 h-full shadow-sm hover:shadow-xl hover:border-bright-blue/30 transition-all rounded-3xl">
                <LayoutDashboard className="w-12 h-12 text-bright-blue mb-6" />
                <h3 className="text-2xl font-black text-navy mb-4">Editorial Command</h3>
                <p className="text-slate-600 font-medium leading-relaxed">Advanced tools for editors to manage the entire publication pipeline from review to final print.</p>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-bright-blue/5 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-news-red/5 blur-[100px] rounded-full -z-10" />
      </main>
      <Footer />
    </div>
  );
}
