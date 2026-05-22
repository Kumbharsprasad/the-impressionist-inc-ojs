import { NextResponse } from 'next/server'
import dns from 'dns/promises'

export const runtime = 'nodejs'

export async function GET() {
  const dbUrl = process.env.DATABASE_URL
  const defaultHost = 'db.jjnillmcprpxgykqaeun.supabase.co'

  let host = defaultHost
  if (dbUrl) {
    try {
      // postgres://user:pass@host:port/db -> replace scheme so URL can parse
      const parsed = new URL(dbUrl.replace(/^postgres(ql)?:\/\//, 'http://'))
      host = parsed.hostname
    } catch {
      host = defaultHost
    }
  }

  try {
    const res = await dns.lookup(host)
    return NextResponse.json({ ok: true, host, address: res.address, family: res.family })
  } catch (err: any) {
    return NextResponse.json({ ok: false, host, error: String(err) }, { status: 500 })
  }
}
