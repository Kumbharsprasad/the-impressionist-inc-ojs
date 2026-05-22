'use client';

import { Linkedin, Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-navy/95 border-t border-white/5 py-12">
            <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">
                    © 2026 The Impressionist Inc. All rights reserved
                </p>
                <div className="flex items-center justify-center gap-6">
                    <Link href="#" className="text-white/20 hover:text-bright-blue transition-all hover:scale-110">
                        <Twitter className="w-4 h-4" />
                    </Link>
                    <Link href="#" className="text-white/20 hover:text-bright-blue transition-all hover:scale-110">
                        <Linkedin className="w-4 h-4" />
                    </Link>
                    <Link href="#" className="text-white/20 hover:text-bright-blue transition-all hover:scale-110">
                        <Instagram className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </footer>
    );
}
