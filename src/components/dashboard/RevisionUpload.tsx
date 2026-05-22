'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { UploadCloud, CheckCircle, FileText, Loader2 } from 'lucide-react';
import { uploadRevisionAction } from '@/app/dashboard/actions';
import { toast } from 'sonner';

export default function RevisionUpload({ submissionId }: { submissionId: number }) {
    const [isOpen, setIsOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [pdfUrl, setPdfUrl] = useState('');
    const [submitting, setSubmitting] = useState(false);

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
                    toast.success("File uploaded successfully");
                } else {
                    toast.error("Upload failed");
                }
            } catch (err) {
                console.error('Upload failed');
                toast.error("Upload error");
            } finally {
                setUploading(false);
            }
        }
    };

    const handleFinalSubmit = async () => {
        if (!pdfUrl) return;
        setSubmitting(true);
        try {
            const res = await uploadRevisionAction(submissionId, pdfUrl);
            if (res?.error) {
                toast.error(res.error);
            } else {
                toast.success("Revision submitted! It has been sent back to the original reviewer.");
                setIsOpen(false);
                setFile(null);
                setPdfUrl('');
            }
        } catch (e) {
            toast.error("Submission failed");
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) {
        return (
            <Button size="sm" onClick={() => setIsOpen(true)} className="bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-500/20 font-black uppercase text-[10px] tracking-widest h-10 px-6 rounded-xl">
                Upload Revision
            </Button>
        );
    }

    return (
        <div className="mt-4 p-6 bg-slate-50 border-2 border-amber-200 rounded-3xl animate-fade-in space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-sm text-amber-700 font-extrabold uppercase tracking-tight">Upload Revised Manuscript</p>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">Cancel</Button>
            </div>

            <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${file ? 'border-emerald-200 bg-white' : 'border-slate-200 bg-white hover:border-amber-300'}`}>
                <input type="file" accept=".pdf" className="hidden" id={`rev-upload-${submissionId}`} onChange={handleFileChange} />

                {!file ? (
                    <label htmlFor={`rev-upload-${submissionId}`} className="cursor-pointer flex flex-col items-center gap-3">
                        <UploadCloud className="w-8 h-8 text-amber-500" />
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Select New PDF</p>
                    </label>
                ) : (
                    <div className="flex items-center justify-center gap-4">
                        <FileText className="w-6 h-6 text-emerald-600" />
                        <div className="text-left">
                            <p className="text-xs font-black text-navy truncate max-w-[150px]">{file.name}</p>
                            <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                                {uploading ? 'Uploading...' : <><CheckCircle className="w-3 h-3" /> Ready</>}
                            </p>
                        </div>
                        {!uploading && <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-[10px] text-slate-400" onClick={() => { setFile(null); setPdfUrl(''); }}>Change</Button>}
                    </div>
                )}
            </div>

            <Button
                className="w-full h-12 bg-navy hover:bg-black text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-50 shadow-xl shadow-navy/10"
                onClick={handleFinalSubmit}
                disabled={!pdfUrl || uploading || submitting}
            >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Finalize Revision
            </Button>
        </div>
    );
}
