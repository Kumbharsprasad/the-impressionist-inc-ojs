import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  const hasDatabaseUrl = !!process.env.DATABASE_URL
  let host: string | null = null
  if (hasDatabaseUrl) {
    try {
      const parsed = new URL(process.env.DATABASE_URL.replace(/^postgres(ql)?:\/\//, 'http://'))
      host = parsed.hostname
    } catch {}
  }

  return NextResponse.json({ ok: true, hasDatabaseUrl, host })
}
