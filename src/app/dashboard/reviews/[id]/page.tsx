import { db } from '@/db/index';
import { submissions, reviews } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { redirect, notFound } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { submitReviewAction } from '@/app/dashboard/actions'; // Server action
import { Card } from '@/components/ui/Card';
import { FileText, ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';

export default async function ReviewDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await getSession();
    if (!session || session.user.role !== 'reviewer') redirect('/dashboard');

    const reviewId = parseInt(params.id);

    const reviewData = await db.select({
        id: reviews.id,
        submissionId: submissions.id,
        title: submissions.title,
        abstract: submissions.abstract,
        pdfUrl: submissions.pdfUrl,
        feedback: reviews.feedback,
        decision: reviews.decision,
        status: reviews.completedAt,
    })
        .from(reviews)
        .leftJoin(submissions, eq(reviews.submissionId, submissions.id))
        .where(eq(reviews.id, reviewId))
        .limit(1);

    if (reviewData.length === 0) notFound();

    const review = reviewData[0];
    const isCompleted = !!review.status;

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
            <div className="flex items-center gap-4">
                <Link href="/dashboard">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Review Assignment #{review.id}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Manuscript Details */}
                <Card className="p-6 space-y-6 bg-slate-900/40 border-slate-800">
                    <div>
                        <h2 className="text-xl font-bold text-navy">{review.title}</h2>
                        <p className="text-slate-400 mt-4 leading-relaxed">{review.abstract}</p>
                    </div>

                    <div className="pt-6 border-t border-slate-800">
                        <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-500 mb-4">Manuscript File</h3>
                        <div className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-800">
                            <div className="flex items-center gap-3">
                                <FileText className="w-8 h-8 text-indigo-400" />
                                <div>
                                    <p className="text-sm font-medium text-slate-200">Full Manuscript.pdf</p>
                                    <p className="text-xs text-slate-500 hidden sm:block">{review.pdfUrl}</p>
                                </div>
                            </div>
                            <Link href={review.pdfUrl!} target="_blank" rel="noopener noreferrer">
                                <Button size="sm" variant="outline">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>

                {/* Review Form */}
                <Card className="p-6 bg-slate-900/60 border-indigo-500/20 shadow-xl shadow-indigo-900/10">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-navy">
                        Your Evaluation
                        {isCompleted && <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded uppercase">Submitted</span>}
                    </h2>

                    {isCompleted ? (
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-950 rounded border border-slate-800">
                                <p className="text-xs text-slate-500 uppercase mb-1">Feedback</p>
                                <p className="text-slate-300 whitespace-pre-wrap">{review.feedback}</p>
                            </div>
                            <div className="p-4 bg-slate-950 rounded border border-slate-800">
                                <p className="text-xs text-slate-500 uppercase mb-1">Decision</p>
                                <p className={`font-bold uppercase ${review.decision === 'accept' ? 'text-emerald-400' :
                                    review.decision === 'reject' ? 'text-red-400' : 'text-amber-400'
                                    }`}>{review.decision}</p>
                            </div>
                        </div>
                    ) : (
                        <form action={async (formData) => {
                            'use server';
                            const feedback = formData.get('feedback') as string;
                            const decision = formData.get('decision') as any;
                            await submitReviewAction(reviewId, feedback, decision);
                            redirect('/dashboard');
                        }} className="space-y-6">

                            <div>
                                <label className="text-sm font-medium text-slate-300 mb-2 block">Constructive Feedback</label>
                                <Textarea
                                    name="feedback"
                                    placeholder="Please provide detailed feedback for the authors..."
                                    className="min-h-[200px]"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-300 mb-2 block">Decision</label>
                                <select name="decision" className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 font-medium" required>
                                    <option value="">Select Recommendation...</option>
                                    <option value="revision">Request Revision</option>
                                    <option value="accept">Accept Submission</option>
                                    <option value="reject">Reject Submission</option>
                                </select>
                            </div>

                            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20">
                                Submit Review
                            </Button>
                        </form>
                    )}
                </Card>
            </div>
        </div>
    );
}
