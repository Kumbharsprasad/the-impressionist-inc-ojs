'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, FileText, Settings, LogOut, Upload, Users, BookOpen } from 'lucide-react';
import { logoutAction } from '@/app/auth-actions';

export default function Sidebar({ user }: { user: any }) {
    const pathname = usePathname();

    const links = [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        ...(user.role === 'editor' ? [
            { href: '/dashboard/rooms', label: 'My Journal Rooms', icon: Users }
        ] : []),
        { href: '/dashboard/profile', label: 'Profile Settings', icon: Settings },
    ];

    return (
        <div className="w-64 h-full bg-black border-r border-white/10 flex flex-col">
            <div className="p-6">
                <h2 className="text-xl font-bold text-white tracking-wider flex items-center gap-2">
                    <span className="w-8 h-8 bg-medium-blue rounded-lg flex items-center justify-center text-xs">TII</span>
                    OJS
                </h2>
                <div className="mt-4 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-white/50 uppercase font-black mt-1">{user.role}</p>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all",
                                isActive
                                    ? "bg-medium-blue text-white shadow-lg shadow-medium-blue/20"
                                    : "text-white/60 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Icon className="w-5 h-5 shadow-sm" />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/5">
                <form action={logoutAction}>
                    <button className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-white/40 hover:text-news-red w-full transition-colors group">
                        <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        Sign Out
                    </button>
                </form>
            </div>
        </div>
    );
}
