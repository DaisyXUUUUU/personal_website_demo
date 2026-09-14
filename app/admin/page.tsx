import type { Metadata } from 'next'
import { getAdminSession } from '@/lib/admin-auth'
import { siteContent } from '@/lib/site-content'
import { AdminEditor } from './admin-editor'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Portfolio Studio — Ziyue Xu',
  robots: { index: false, follow: false },
}

const ERRORS: Record<string, string> = {
  setup: 'Admin login has not been configured yet.',
  oauth: 'GitHub login could not be completed. Please try again.',
  forbidden: 'This GitHub account is not allowed to edit the website.',
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const session = await getAdminSession()
  const { error } = await searchParams

  if (!session) {
    return (
      <main className="min-screen-dynamic flex items-center justify-center bg-[#120b12] px-5 py-12 text-hero-card">
        <section className="w-full max-w-lg rounded-3xl border border-hero-pink/35 bg-white/5 p-7 shadow-2xl sm:p-10">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.28em] text-hero-pink">Private workspace</p>
          <h1 className="mt-5 text-4xl font-black tracking-tighter text-hero-pink sm:text-5xl">Portfolio Studio</h1>
          <p className="mt-5 leading-relaxed text-hero-card/75">
            Sign in with the authorized GitHub account to edit Ziyue&apos;s education, skills, work, projects, and hobbies.
          </p>
          {error && <p className="mt-5 rounded-xl border border-red-300/30 bg-red-400/10 p-3 text-sm text-red-200">{ERRORS[error] ?? ERRORS.oauth}</p>}
          <a
            href="/api/admin/auth/login"
            className="mt-8 flex w-full items-center justify-center rounded-xl bg-hero-pink px-5 py-4 font-black text-hero-ink transition-transform hover:-translate-y-0.5"
          >
            Sign in with GitHub
          </a>
          <a href="/" className="mt-5 block text-center font-mono text-xs uppercase tracking-widest text-hero-card/55 hover:text-hero-pink">
            ← Return to website
          </a>
        </section>
      </main>
    )
  }

  return <AdminEditor initialContent={siteContent} login={session.login} />
}
