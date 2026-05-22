'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card } from '@/components/ui/Card';
import { UploadCloud, FileText, CheckCircle, ArrowRight } from 'lucide-react';
import { createSubmission } from '@/app/dashboard/actions'; // Server Action

export default function NewSubmissionForm({ conferenceId }: { conferenceId?: number }) {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [pdfUrl, setPdfUrl] = useState('');

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setUploading(true);

            const formData = new FormData();
            formData.append('file', selectedFile);

            try {
                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });
                const data = await res.json();
                if (data.success) {
                    setPdfUrl(data.url);
                }
            } catch (err) {
                console.error('Upload failed');
            } finally {
                setUploading(false);
            }
        }
    };

    async function handleSubmit(formData: FormData) {
        if (!pdfUrl) return;
        formData.append('pdfUrl', pdfUrl);
        if (conferenceId) {
            formData.append('conferenceId', conferenceId.toString());
        }
        await createSubmission(formData);
    }

    return (
        <form action={handleSubmit} className="space-y-10">
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-black text-navy uppercase tracking-widest ml-1">Manuscript Title</label>
                    <Input name="title" placeholder="Enter the full title of your research paper" required className="bg-slate-50 border-slate-200 focus:border-bright-blue h-14 rounded-2xl px-6 text-lg font-bold" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-navy uppercase tracking-widest ml-1">Research Theme</label>
                        <Input name="theme" placeholder="e.g., Cyber Security, AI, Policy" required className="bg-slate-50 border-slate-200 focus:border-bright-blue h-12 rounded-xl px-4 font-bold" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-navy uppercase tracking-widest ml-1">Keywords</label>
                        <Input name="keywords" placeholder="Security, India, Defense" required className="bg-slate-50 border-slate-200 focus:border-bright-blue h-12 rounded-xl px-4 font-bold" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black text-navy uppercase tracking-widest ml-1">Abstract</label>
                    <Textarea name="abstract" placeholder="Provide a concise summary of your research..." required className="min-h-[160px] bg-slate-50 border-slate-200 focus:border-bright-blue rounded-[24px] p-6 font-medium leading-relaxed" />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black text-navy uppercase tracking-widest ml-1">Manuscript File (PDF)</label>
                    <div className={`relative border-4 border-dashed rounded-[32px] p-12 transition-all text-center flex flex-col items-center justify-center gap-4 ${file ? 'border-emerald-100 bg-emerald-50/30' : 'border-slate-100 bg-slate-50/50 hover:border-bright-blue/30'}`}>
                        <input type="file" accept=".pdf" onChange={handleFileChange} required className="absolute inset-0 opacity-0 cursor-pointer" />

                        {file ? (
                            <div className="space-y-2">
                                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                                <p className="text-navy font-black">{file.name}</p>
                                <Button type="button" variant="ghost" size="sm" onClick={() => { setFile(null); setPdfUrl(''); }} className="text-red-500 font-bold hover:bg-red-50">Change File</Button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <UploadCloud className="w-12 h-12 text-slate-300 mx-auto group-hover:text-bright-blue transition-colors" />
                                <p className="text-slate-400 font-bold">Drop your manuscript here or click to browse</p>
                                <p className="text-[10px] text-slate-300 font-black uppercase tracking-tighter">PDF Format Only (Max 10MB)</p>
                            </div>
                        )}

                        {uploading && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-[32px]">
                                <div className="flex items-center gap-3 text-bright-blue font-black animate-pulse uppercase tracking-widest text-xs">
                                    <div className="w-4 h-4 border-2 border-bright-blue border-t-transparent rounded-full animate-spin" />
                                    Uploading...
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Button type="submit" disabled={!pdfUrl || uploading} className="w-full h-18 bg-bright-blue hover:bg-navy text-white rounded-3xl font-black text-xl shadow-2xl shadow-bright-blue/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4 border-none disabled:opacity-50">
                Submit for Selection
                <ArrowRight className="w-6 h-6" />
            </Button>
        </form>
    );
}
