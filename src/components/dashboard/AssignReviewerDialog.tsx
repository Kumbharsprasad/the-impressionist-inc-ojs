'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { assignReviewerAction } from '@/app/dashboard/actions'; // Server Action
import { UserPlus, UserCheck, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AssignReviewerDialog({ submissionId, reviewers }: { submissionId: number, reviewers: { id: number, name: string }[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedReviewer, setSelectedReviewer] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const handleAssign = async () => {
        if (!selectedReviewer) return;
        setLoading(true);
        try {
            await assignReviewerAction(submissionId, parseInt(selectedReviewer));
            setLoading(false);
            setIsOpen(false);
            setSelectedReviewer('');
        } catch (e) {
            setLoading(false);
        }
    };

    return (
        <div className={`relative ${isOpen ? 'z-[200]' : 'z-10'}`}>
            <Button
                size="sm"
                variant="outline"
                onClick={() => setIsOpen(!isOpen)}
                className={`h-12 rounded-2xl border-2 transition-all font-black uppercase text-[10px] tracking-widest ${isOpen ? 'border-bright-blue bg-bright-blue/5 text-bright-blue' : 'border-slate-100 text-navy'
                    }`}
            >
                {isOpen ? 'Close' : 'Assign Faculty'}
                <UserPlus className="w-4 h-4 ml-2" />
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="absolute right-0 top-full mt-4 z-[100] w-80 bg-white p-8 rounded-[32px] border-2 border-bright-blue/20 shadow-2xl shadow-navy/30 space-y-6"
                    >
                        <div className="space-y-1">
                            <h4 className="text-xs font-black text-navy uppercase tracking-widest">Select Room Expert</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Only invited reviewers are eligible</p>
                        </div>

                        <div className="space-y-4">
                            <select
                                className="w-full h-12 bg-slate-50 text-xs text-navy font-black border-2 border-slate-100 rounded-2xl px-4 appearance-none focus:outline-none focus:border-bright-blue transition-all cursor-pointer"
                                value={selectedReviewer}
                                onChange={(e) => setSelectedReviewer(e.target.value)}
                            >
                                <option value="">Select Candidate...</option>
                                {reviewers.map(r => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                            </select>

                            <Button
                                size="sm"
                                onClick={handleAssign}
                                disabled={!selectedReviewer || loading}
                                className="w-full h-12 rounded-2xl bg-navy hover:bg-black text-white font-black uppercase text-xs tracking-widest shadow-lg shadow-navy/20"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : 'Confirm Assignment'}
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
