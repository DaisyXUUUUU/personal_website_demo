'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowUpRight, X } from 'lucide-react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useSiteContent } from '@/components/site-content-provider'
import type { ProjectItem } from '@/lib/site-content'

export function Experience() {
  const { projects } = useSiteContent()
  const sectionRef = useRef<HTMLElement>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [scrollPhase, setScrollPhase] = useState(0)
  const [canScatter, setCanScatter] = useState(false)
  const reduceMotion = useReducedMotion()
  const active = projects.find((i) => i.id === activeId) ?? null
  const years = Array.from(new Set(projects.map((item) => item.year))).sort((a, b) => Number(b) - Number(a))
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1100px) and (min-height: 720px)')
    const update = () => setCanScatter(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setScrollPhase(latest)
  })

  const introLift = useTransform(scrollYProgress, [0.06, 0.24], [88, 0])
  const introOpacity = useTransform(scrollYProgress, [0.04, 0.22], [0, 1])
  const timelineDraw = useTransform(scrollYProgress, [0.08, 0.34], [0, 1])
  const timelineFade = useTransform(scrollYProgress, [0.74, 0.96], [1, 0])
  const timelineRise = useTransform(scrollYProgress, [0.74, 0.96], [0, -34])
  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.72, 1],
    ['rgb(245 188 212)', 'rgb(245 188 212)', 'rgb(255 247 239)'],
  )

  const scatterProgress = reduceMotion || !canScatter ? 0 : Math.min(1, Math.max(0, (scrollPhase - 0.76) / 0.24))

  return (
    <motion.section
      id="projects"
      ref={sectionRef}
      className="scroll-mt-24 border-t-2 border-hero-pink/30 bg-hero-bg-2 py-20 text-hero-ink md:py-28"
      style={{ backgroundColor: bgColor }}
    >
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <motion.div className="mb-10 flex items-center gap-6" style={{ opacity: introOpacity }}>
          <motion.span
            className="font-mono text-sm font-semibold uppercase tracking-[0.25em] text-hero-pink"
            style={{ y: introLift }}
          >
            Projects
          </motion.span>
          <span className="h-px flex-1 bg-hero-pink/60" aria-hidden />
        </motion.div>

        <motion.h2
          className="section-title-fluid text-pretty font-black tracking-tighter text-hero-pink"
          style={{ y: introLift, opacity: introOpacity }}
        >
          What I&apos;ve built.
        </motion.h2>

        {/* Reverse-chronological groups. Each group pairs a sticky year label with its cards,
            so the year follows the scroll until that group's cards have scrolled away. */}
        <div className="relative mt-12">
          {/* continuous vertical rail behind the sticky dots */}
          <motion.div
            className="absolute left-3 top-0 hidden h-full w-px bg-hero-pink/40 md:block"
            style={{ scaleY: timelineDraw, opacity: timelineFade, y: timelineRise, transformOrigin: 'top' }}
            aria-hidden
          />

          {years.map((year) => (
            <div key={year} className="flex gap-6 md:gap-10">
              {/* Left — sticky year that follows the scroll within this group */}
              <motion.div
                className="relative hidden shrink-0 md:block"
                style={{ opacity: timelineFade, y: timelineRise }}
              >
                <div className="sticky top-24 pb-10 pl-10">
                  <span
                    className="absolute left-1 top-4 size-4 rounded-full border-2 border-hero-pink bg-hero-card"
                    aria-hidden
                  />
                  <span className="text-5xl font-black tracking-tighter text-hero-ink lg:text-6xl">
                    {year}
                  </span>
                </div>
              </motion.div>

              {/* Right — project cards for this year */}
              <div className="mb-10 flex-1">
                <span className="mb-4 block text-4xl font-black tracking-tighter text-hero-ink md:hidden">
                  {year}
                </span>
                <div className="grid gap-5 sm:grid-cols-2">
                  {projects.filter((i) => i.year === year).map((item, idx) => (
                    <ProjectCard
                      key={item.id}
                      item={item}
                      cardIndex={idx + projects.findIndex((entry) => entry.id === item.id)}
                      scatterProgress={scatterProgress}
                      onOpen={() => setActiveId(item.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {active && <ProjectModal item={active} onClose={() => setActiveId(null)} />}
    </motion.section>
  )
}

function ProjectCard({
  item,
  cardIndex,
  scatterProgress,
  onOpen,
}: {
  item: ProjectItem
  cardIndex: number
  scatterProgress: number
  onOpen: () => void
}) {
  const direction = cardIndex % 2 === 0 ? -1 : 1
  const scatterX = direction * (58 + (cardIndex % 3) * 22) * scatterProgress
  const scatterY = (18 + (cardIndex % 4) * 11) * scatterProgress
  const scatterRotate = direction * (5 + (cardIndex % 3) * 2.5) * scatterProgress

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.02 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: Math.min(cardIndex * 0.05, 0.28), ease: [0.22, 1, 0.36, 1] }}
      style={{
        x: scatterX,
        y: scatterY,
        rotate: scatterRotate,
        scale: 1 - scatterProgress * 0.08,
      }}
      className="group flex min-w-0 flex-col overflow-hidden rounded-3xl border border-hero-pink/40 bg-hero-card p-4 text-left text-hero-ink transition-all duration-300 hover:border-hero-pink hover:bg-hero-ink hover:text-hero-card hover:shadow-[0_24px_48px_rgba(222,89,143,0.22)]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
        <Image
          src={item.image || '/placeholder.svg'}
          alt={`${item.org} preview`}
          fill
          className="object-cover transition-transform duration-500 group-hover:translate-y-[-4px] group-hover:scale-[1.08]"
          sizes="(max-width: 640px) 90vw, 40vw"
        />
      </div>

      <p className="mt-4 font-mono text-xs text-hero-pink">{item.period}</p>
      <h3 className="mt-1 text-pretty text-xl font-black leading-tight tracking-tight">
        {item.org}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-hero-muted transition-colors duration-300 group-hover:text-hero-card/70">
        {item.summary}
      </p>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="min-w-0 break-words rounded-full bg-hero-pink px-3 py-1 font-mono text-[11px] font-medium text-hero-card">
          {item.tags.join(' | ')}
        </span>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-hero-pink text-hero-pink transition-colors duration-300 group-hover:border-hero-card group-hover:bg-hero-card group-hover:text-hero-ink">
          <ArrowUpRight className="size-4" />
        </span>
      </div>
    </motion.button>
  )
}

function ProjectModal({ item, onClose }: { item: ProjectItem; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:p-6 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={item.org}
    >
      <div className="absolute inset-0 bg-hero-ink/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 max-h-[calc(100dvh-1.5rem)] w-full max-w-3xl overflow-y-auto overscroll-contain rounded-[1.5rem] bg-hero-card text-hero-ink shadow-2xl sm:max-h-[88dvh] sm:rounded-3xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full border border-hero-pink bg-hero-card text-hero-pink transition-colors hover:bg-hero-pink hover:text-hero-card"
        >
          <X className="size-4" />
        </button>

        <div className="p-6 md:p-8">
          <p className="font-mono text-sm text-hero-ink">{item.period}</p>
          <h3 className="mt-1 text-pretty text-2xl font-black tracking-tight text-hero-pink md:text-3xl">
            {item.org}
          </h3>

          <span className="mt-3 inline-block rounded-full bg-hero-pink px-4 py-1.5 font-mono text-xs font-medium text-hero-card">
            {item.tags.join(' | ')}
          </span>

          <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-hero-pink/20">
            <Image
              src={item.image || '/placeholder.svg'}
              alt={`${item.org} preview`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 90vw, 700px"
            />
          </div>

          <ul className="mt-6 space-y-4">
            {item.bullets.map((b, idx) => (
              <li key={idx} className="flex gap-3 text-pretty leading-relaxed text-hero-ink">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-hero-pink" aria-hidden />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <h4 className="text-lg font-black tracking-tight text-hero-pink">Skills &amp; Tools</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {item.skills.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-hero-pink/60 px-3 py-1 font-mono text-xs text-hero-ink"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {item.link && (
            <a
              href={item.link.href}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-widest text-hero-pink"
            >
              {item.link.label}
              <ArrowUpRight className="size-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
