import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
        return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;

    // If Supabase is configured, upload to Supabase Storage
    if (supabase) {
        try {
            const bucket = 'uploads';
            const { error: uploadError } = await supabase.storage.from(bucket).upload(filename, buffer, {
                contentType: (file as any).type || 'application/octet-stream',
                upsert: false,
            });

            if (uploadError) {
                console.error('Supabase upload error', uploadError);
                throw uploadError;
            }

            const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
            const publicUrl = (data as any)?.publicUrl || `/uploads/${filename}`;

            return NextResponse.json({ success: true, url: publicUrl });
        } catch (e) {
            console.error('Supabase upload failed, falling back to local', e);
            // fallback to local below
        }
    }

    // Fallback: write to local public/uploads (note: ephemeral on Vercel)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    try {
        await mkdir(uploadDir, { recursive: true });
    } catch (e) { }

    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    return NextResponse.json({ success: true, url: `/uploads/${filename}` });
}
