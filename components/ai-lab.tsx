'use client'

import { useEffect, useState, type PointerEvent as ReactPointerEvent } from 'react'
import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { useSiteContent } from '@/components/site-content-provider'
import { BrowserFrame, LabLinks, VideoModal } from '@/components/lab-shared'
import { labItems, type LabItem } from '@/lib/site-content'
import { resolveVideo } from '@/lib/video'

export function AiLab() {
  const items = labItems(useSiteContent())
  const [watching, setWatching] = useState<LabItem | null>(null)

  if (items.length === 0) return null

  // Pink spotlight follows the pointer across the section.
  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`)
  }

  return (
    <section
      id="lab"
      onPointerMove={onPointerMove}
      className="lab-surface relative scroll-mt-24 overflow-hidden border-t-2 border-hero-pink/30 py-20 text-hero-card md:py-28"
    >
      <div className="relative mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="mb-10 flex items-center gap-6">
          <span className="font-mono text-sm font-semibold uppercase tracking-[0.25em] text-hero-pink">AI Lab</span>
          <span className="h-px flex-1 bg-hero-pink/55" aria-hidden />
          <span className="font-mono text-xs text-hero-card/45">{String(items.length).padStart(2, '0')} prototypes</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <h2 className="section-title-fluid text-pretty font-black tracking-tighter text-hero-pink">
            Prompted into being.
          </h2>
          <p className="max-w-xl text-pretty leading-relaxed text-hero-card/70 md:text-lg">
            Vibe-coded products exploring LLMs for UX prototyping: using natural language and AI to design,
            build and test real interfaces with real people.
          </p>
        </div>

        <PromptTerminal items={items} />

        <div className="mt-16 space-y-24 md:mt-24 md:space-y-32">
          {items.map((item, index) => (
            <LabCard key={item.id} item={item} index={index} total={items.length} onWatch={() => setWatching(item)} />
          ))}
        </div>
      </div>

      <VideoModal item={watching} onClose={() => setWatching(null)} />
    </section>
  )
}

/** A terminal that types each project's founding prompt, then "compiles" it into the project title. */
function PromptTerminal({ items }: { items: LabItem[] }) {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [typed, setTyped] = useState(0)
  const [phase, setPhase] = useState<'typing' | 'done' | 'erasing'>('typing')
  const item = items[index % items.length]
  const prompt = item.prompt

  useEffect(() => {
    if (reduceMotion) {
      setTyped(prompt.length)
      setPhase('done')
      const timer = window.setTimeout(() => {
        setIndex((value) => value + 1)
      }, 5000)
      return () => window.clearTimeout(timer)
    }
    let timer: number
    if (phase === 'typing') {
      if (typed < prompt.length) timer = window.setTimeout(() => setTyped((value) => value + 1), 26 + Math.random() * 40)
      else timer = window.setTimeout(() => setPhase('done'), 350)
    } else if (phase === 'done') {
      timer = window.setTimeout(() => setPhase('erasing'), 3200)
    } else if (typed > 0) {
      timer = window.setTimeout(() => setTyped((value) => Math.max(0, value - 3)), 12)
    } else {
      timer = window.setTimeout(() => {
        setIndex((value) => value + 1)
        setPhase('typing')
      }, 250)
    }
    return () => window.clearTimeout(timer)
  }, [phase, typed, prompt, reduceMotion])

  return (
    <div className="mt-12 overflow-hidden rounded-2xl border border-hero-pink/30 bg-black/40 font-mono text-sm shadow-2xl backdrop-blur md:text-base">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-[11px] text-hero-card/45">
        <span>~/ziyue/lab — natural-language → prototype</span>
        <span className="hidden sm:inline">{(index % items.length) + 1}/{items.length}</span>
      </div>
      <div className="min-h-[7.5rem] px-4 py-4 md:px-6 md:py-5">
        <p className="text-pretty leading-relaxed text-hero-card">
          <span className="select-none text-hero-pink">❯ </span>
          {prompt.slice(0, typed)}
          <span className="lab-caret ml-0.5 inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-hero-pink" aria-hidden />
        </p>
        <motion.a
          href={`#lab-${item.slug}`}
          initial={false}
          animate={{ opacity: phase === 'done' ? 1 : 0, y: phase === 'done' ? 0 : 6 }}
          className="mt-3 inline-flex items-center gap-2 text-hero-card/60 hover:text-hero-pink"
          tabIndex={phase === 'done' ? 0 : -1}
        >
          <span className="text-emerald-300">✔ shipped</span>
          <span className="text-hero-card">{item.title}</span>
          <ArrowRight className="size-4" />
        </motion.a>
      </div>
    </div>
  )
}

function LabCard({ item, index, total, onWatch }: { item: LabItem; index: number; total: number; onWatch: () => void }) {
  const reverse = index % 2 === 1
  const hasVideo = Boolean(resolveVideo(item.videoUrl))
  const reduceMotion = useReducedMotion()

  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rotateY = useSpring(useTransform(px, [0, 1], [-9, 9]), { stiffness: 180, damping: 18 })
  const rotateX = useSpring(useTransform(py, [0, 1], [7, -7]), { stiffness: 180, damping: 18 })
  const glareX = useTransform(px, (value) => `${value * 100}%`)
  const glareY = useTransform(py, (value) => `${value * 100}%`)
  const glare = useTransform([glareX, glareY], ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.22), transparent 55%)`)

  const onMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduceMotion || event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    px.set((event.clientX - rect.left) / rect.width)
    py.set((event.clientY - rect.top) / rect.height)
  }
  const onLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  const steps = [
    { label: 'Problem', text: item.problem },
    { label: 'Built', text: item.built },
    { label: 'Learned', text: item.learned },
  ]

  return (
    <article id={`lab-${item.slug}`} className="grid scroll-mt-32 items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <motion.div
        className={`group relative [perspective:1200px] ${reverse ? 'lg:order-2' : ''}`}
        initial={{ opacity: 0, x: reverse ? 60 : -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <span aria-hidden className={`lab-index pointer-events-none absolute -top-14 select-none text-[7rem] font-black leading-none tracking-tighter md:-top-20 md:text-[10rem] ${reverse ? 'right-0' : 'left-0'}`}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <motion.div
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className="relative"
        >
          <button
            type="button"
            onClick={hasVideo ? onWatch : undefined}
            disabled={!hasVideo}
            aria-label={hasVideo ? `Play ${item.title} walkthrough` : `${item.title} preview`}
            className="relative block w-full text-left disabled:cursor-default"
          >
            <BrowserFrame item={item} />
            <motion.span aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl" style={{ background: glare }} />
            {hasVideo && (
              <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-hero-pink py-3 pl-4 pr-5 font-black text-hero-ink shadow-2xl transition-transform duration-300 [transform:translateZ(60px)] group-hover:scale-110">
                <Play className="size-5 fill-current" /> 2 min
              </span>
            )}
          </button>
        </motion.div>
        {item.highlight && (
          <motion.span
            className={`absolute -bottom-5 rounded-full border-2 border-[#120b12] bg-hero-card px-4 py-2 text-sm font-black text-hero-ink shadow-xl ${reverse ? 'left-4' : 'right-4'}`}
            initial={{ scale: 0, rotate: -12 }}
            whileInView={{ scale: 1, rotate: reverse ? 4 : -4 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.4 }}
          >
            {item.highlight}
          </motion.span>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <p className="font-mono text-xs uppercase tracking-widest text-hero-pink/90">
          {item.date} · {item.context}
        </p>
        <h3 className="mt-3 text-pretty text-3xl font-black leading-[1.02] tracking-tighter md:text-4xl">
          <Link href={`/lab/${item.slug}`} className="transition-colors hover:text-hero-pink">{item.title}</Link>
        </h3>
        <p className="mt-3 text-pretty text-lg leading-relaxed text-hero-card/75">{item.tagline}</p>

        <ol className="mt-7 space-y-4 border-l border-hero-pink/30 pl-5">
          {steps.map((step, stepIndex) => (
            <motion.li
              key={step.label}
              className="relative"
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + stepIndex * 0.12 }}
            >
              <span className="absolute -left-[1.6rem] top-1.5 size-2.5 rounded-full bg-hero-pink ring-4 ring-[#120b12]" aria-hidden />
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-hero-pink">{step.label}</span>
              <p className="mt-0.5 text-pretty text-sm leading-relaxed text-hero-card/80 md:text-[15px]">{step.text}</p>
            </motion.li>
          ))}
        </ol>

        {item.tools.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-1.5">
            {item.tools.map((tool) => (
              <span key={tool} className="rounded-full border border-hero-card/20 px-2.5 py-1 font-mono text-[11px] text-hero-card/70">{tool}</span>
            ))}
          </div>
        )}

        <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
          <LabLinks item={item} onWatch={onWatch} />
          <Link href={`/lab/${item.slug}`} className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-widest text-hero-card/60 transition-colors hover:text-hero-pink">
            Case study <ArrowRight className="size-4" />
          </Link>
        </div>
        <span className="sr-only">Prototype {index + 1} of {total}</span>
      </motion.div>
    </article>
  )
}
