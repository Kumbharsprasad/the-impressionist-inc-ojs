declare module '@supabase/ssr' {
  import type { Cookie } from 'next/headers'
  export function createServerClient(url: string, key: string, opts?: any): any
  export function createBrowserClient(url: string, key: string, opts?: any): any
}
