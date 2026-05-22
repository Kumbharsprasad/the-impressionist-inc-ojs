import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();

    if (!session) {
        redirect('/login');
    }

    return (
        <div className="flex h-screen bg-white text-navy font-sans">
            <Sidebar user={session.user} />
            <main className="flex-1 overflow-auto relative">
                <div className="max-w-7xl mx-auto p-8 animate-fade-in text-slate-800">
                    {children}
                </div>
            </main>
        </div>
    );
}
