import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AuthorDashboard from '@/components/dashboard/AuthorDashboard';
import EditorView from '@/components/dashboard/EditorView';
import ReviewerView from '@/components/dashboard/ReviewerView';

export default async function DashboardPage() {
    const session = await getSession();

    if (!session) redirect('/login');

    const { role, id } = session.user;

    return (
        <>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-navy mb-2">Dashboard</h1>
                    <p className="text-slate-500 font-medium text-lg">
                        Welcome back, <span className="text-medium-blue font-bold">{session.user.name}</span>
                    </p>
                </div>
                <div className="px-4 py-1.5 bg-navy text-white rounded-full text-xs uppercase font-black tracking-widest">
                    {role} Account
                </div>
            </div>

            {role === 'author' && <AuthorDashboard authorId={id} />}
            {role === 'editor' && <EditorView editorId={id} />}
            {role === 'reviewer' && <ReviewerView reviewerId={id} />}
        </>
    );
}
