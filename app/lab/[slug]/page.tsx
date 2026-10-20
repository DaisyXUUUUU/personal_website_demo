import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { BrowserFrame, LabLinks } from '@/components/lab-shared'
import { labItems, siteContent } from '@/lib/site-content'

type Params = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return labItems(siteContent).map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const item = labItems(siteContent).find((entry) => entry.slug === slug)
  if (!item) return {}
  return {
    title: `${item.title} — Ziyue Xu AI Lab`,
    description: item.tagline,
    openGraph: item.cover ? { images: [item.cover] } : undefined,
  }
}

export default async function LabCaseStudy({ params }: Params) {
  const { slug } = await params
  const items = labItems(siteContent)
  const index = items.findIndex((entry) => entry.slug === slug)
  if (index === -1) notFound()
  const item = items[index]
  const next = items.length > 1 ? items[(index + 1) % items.length] : null

  const sections = [
    { label: 'The problem', text: item.problem },
    { label: 'What I built', text: item.built },
    { label: 'What I learned', text: item.learned },
  ]

  return (
    <main className="lab-surface min-screen-dynamic text-hero-card">
      <header className="sticky top-0 z-40 border-b border-hero-pink/20 bg-[#120b12]/85 backdrop-blur">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-4 px-5 py-4 md:px-10">
          <Link href="/#lab" className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-hero-card/70 hover:text-hero-pink">
            <ArrowLeft className="size-4" /> AI Lab
          </Link>
          <Link href="/" className="text-lg font-black uppercase tracking-tight text-hero-pink">Ziyue Xu</Link>
        </div>
      </header>

      <article className="mx-auto max-w-[1100px] px-5 pb-24 pt-12 md:px-10 md:pt-16">
        <p className="font-mono text-xs uppercase tracking-widest text-hero-pink/90">{item.date} · {item.context}</p>
        <h1 className="mt-4 text-balance text-[clamp(2.4rem,6vw,4.5rem)] font-black leading-[0.95] tracking-tighter text-hero-pink">{item.title}</h1>
        <p className="mt-5 max-w-3xl text-pretty text-lg leading-relaxed text-hero-card/80 md:text-xl">{item.tagline}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {item.highlight && <span className="rounded-full bg-hero-card px-4 py-2 text-sm font-black text-hero-ink">{item.highlight}</span>}
          <LabLinks item={item} />
        </div>

        <div className="mt-12">
          <BrowserFrame item={item} />
        </div>

        <div className="mt-8 rounded-2xl border border-hero-pink/30 bg-black/40 p-5 font-mono text-sm md:p-6">
          <p className="text-[11px] uppercase tracking-widest text-hero-card/45">The prompt that started it</p>
          <p className="mt-2 text-pretty leading-relaxed text-hero-card"><span className="text-hero-pink">❯ </span>{item.prompt}</p>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {sections.map((section, sectionIndex) => (
            <section key={section.label}>
              <p className="lab-index text-6xl font-black leading-none tracking-tighter">{String(sectionIndex + 1).padStart(2, '0')}</p>
              <h2 className="mt-3 text-xl font-black tracking-tight text-hero-pink">{section.label}</h2>
              <p className="mt-2 text-pretty leading-relaxed text-hero-card/80">{section.text}</p>
            </section>
          ))}
        </div>

        {(item.tools.length > 0 || item.tags.length > 0) && (
          <div className="mt-14 flex flex-wrap gap-2 border-t border-white/10 pt-8">
            {item.tags.map((tag) => <span key={tag} className="rounded-full bg-hero-pink px-3 py-1 font-mono text-xs font-bold text-hero-ink">{tag}</span>)}
            {item.tools.map((tool) => <span key={tool} className="rounded-full border border-hero-card/25 px-3 py-1 font-mono text-xs text-hero-card/75">{tool}</span>)}
          </div>
        )}

        {next && (
          <Link href={`/lab/${next.slug}`} className="group mt-16 flex items-center justify-between gap-6 rounded-3xl border border-hero-pink/30 p-6 transition-colors hover:border-hero-pink hover:bg-hero-pink hover:text-hero-ink md:p-8">
            <span>
              <span className="font-mono text-xs uppercase tracking-widest text-hero-pink group-hover:text-hero-ink">Next prototype</span>
              <span className="mt-1 block text-2xl font-black tracking-tight md:text-3xl">{next.title}</span>
            </span>
            <ArrowRight className="size-8 shrink-0 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </article>
    </main>
  )
}
