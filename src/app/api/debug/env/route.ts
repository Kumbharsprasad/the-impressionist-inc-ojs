import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  const dbEnv = process.env.DATABASE_URL
  const hasDatabaseUrl = !!dbEnv
  let host: string | null = null
  if (dbEnv) {
    try {
      const parsed = new URL(dbEnv.replace(/^postgres(ql)?:\/\//, 'http://'))
      host = parsed.hostname
    } catch {}
  }

  return NextResponse.json({ ok: true, hasDatabaseUrl, host })
}
