import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Home, SearchX } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex flex-col h-screen w-full items-center justify-center bg-slate-950 text-slate-100 space-y-6">
            <div className="bg-slate-900/50 p-6 rounded-full border border-slate-800">
                <SearchX className="h-12 w-12 text-slate-500" />
            </div>
            <h2 className="text-3xl font-bold">Room Not Found</h2>
            <p className="text-slate-400 max-w-md text-center">
                The invite key you used doesn't match any active journal room. Please check the link and try again.
            </p>
            <Link href="/">
                <Button variant="outline" className="mt-4">
                    <Home className="w-4 h-4 mr-2" />
                    Return Home
                </Button>
            </Link>
        </div>
    );
}
