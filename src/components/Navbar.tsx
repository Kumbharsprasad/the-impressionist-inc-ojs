'use client';

import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Navbar() {
    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={cn(
                "fixed top-6 left-6 right-6 z-50",
                "flex items-center justify-between px-8 py-3",
                "bg-navy/95 backdrop-blur-md border border-white/10 rounded-full",
                "shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
                "transition-all duration-300 hover:border-white/20"
            )}
        >
            <div className="flex items-center gap-2 md:gap-4">
                <Link href="/about-the-impressionist-inc">
                    <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 rounded-full px-4 font-medium transition-all">
                        About The Impressionist Inc
                    </Button>
                </Link>
                <Link href="/about-journal">
                    <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 rounded-full px-4 font-medium transition-all">
                        About Journal
                    </Button>
                </Link>
            </div>

            <div className="flex items-center">
                <Link href="/" className="group flex items-center transition-transform active:scale-95 text-right">
                    <span className="text-xl font-bold tracking-tight text-white group-hover:text-bright-blue transition-colors">
                        The Impressionist Inc
                    </span>
                    <div className="ml-2 w-2 h-2 rounded-full bg-bright-blue animate-pulse" />
                </Link>
            </div>
        </motion.nav>
    );
}
