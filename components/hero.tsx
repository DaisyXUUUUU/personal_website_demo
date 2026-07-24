'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { KeywordMarquee } from '@/components/keyword-marquee'

const TAGLINE = ['From', 'Messy', 'Data', 'To', 'Useful', 'System']
const TITLE_LINES = ['Curious', 'mind.', 'Data', 'hands.', 'Systems', 'heart.']

const EASE_OUT = [0.22, 1, 0.36, 1] as const
const INTRO_HOLD_MS = 220

const EDUCATION = [
  {
    year: '2021 — 2025',
    school: 'University of Nottingham',
    detail:
      'BSc Mathematics with Applied Mathematics · First-Class Honours · GPA 3.9/4.0 · Ningbo China & Nottingham UK',
  },
  {
    year: '2026 — 2028',
    school: 'University of Pennsylvania',
    detail:
      'MSE in Systems Engineering · Focused on AI, data-driven systems, and real-world problem solving · Philadelphia USA',
  },
]

const SKILLS = [
  'Python',
  'SQL',
  'Machine Learning',
  'NLP',
  'Forecasting',
  'Data Visualization',
  'Streamlit',
  'Tableau',
  'PyTorch',
  'scikit-learn',
  'Optimization',
  'RAG Evaluation',
  'Git',
]

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)
  const [introReady, setIntroReady] = useState(false)
  const [activeSkill, setActiveSkill] = useState('Python')
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    let raf = 0
    const update = () => {
      raf = 0
      const rect = section.getBoundingClientRect()
      // Scrollable distance while the inner panel is pinned.
      const scrollable = section.offsetHeight - window.innerHeight
      const scrolled = Math.min(Math.max(-rect.top, 0), scrollable)
      setProgress(scrollable > 0 ? scrolled / scrollable : 0)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    if (reduceMotion) {
      setIntroReady(true)
      return
    }

    const timer = window.setTimeout(() => {
      setIntroReady(true)
    }, INTRO_HOLD_MS)

    return () => window.clearTimeout(timer)
  }, [reduceMotion])

  // Each side column holds two stacked full-height panels; slide up by one panel.
  const slide = { transform: `translateY(${-progress * 50}%)` }
  const introState = reduceMotion ? 'show' : introReady ? 'show' : 'hidden'

  const circleVariants = {
    hidden: { opacity: 0, scale: 0.6 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.46, ease: EASE_OUT, delay: 0.08 },
    },
  }

  const portraitVariants = {
    hidden: { opacity: 0, y: 60, filter: 'blur(8px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.52, ease: EASE_OUT, delay: 0.26 },
    },
  }

  const aboutLabelVariants = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.24, ease: EASE_OUT, delay: 0.48 },
    },
  }

  const aboutLineVariants = {
    hidden: { scaleX: 0, opacity: 0 },
    show: {
      scaleX: 1,
      opacity: 1,
      transition: { duration: 0.28, ease: EASE_OUT, delay: 0.56 },
    },
  }

  const titleLineVariants = {
    hidden: { opacity: 0, y: 26 },
    show: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.28, ease: EASE_OUT, delay: 0.64 + index * 0.08 },
    }),
  }

  const introParagraphVariants = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: EASE_OUT, delay: 1.02 },
    },
  }

  const taglineVariants = {
    hidden: { opacity: 0, x: 30 },
    show: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: EASE_OUT, delay: 0.74 + index * 0.11 },
    }),
  }

  return (
    <section
      id="top"
      ref={sectionRef}
      className="hero-responsive-section relative bg-hero-bg text-hero-ink"
    >
      {/* Mobile and tablet: content-driven flow avoids viewport clipping. */}
      <div className="hero-mobile pt-[calc(var(--site-header-offset,6rem)+1.5rem)]">
        <div className="site-shell grid gap-10 pb-14 sm:gap-14 sm:pb-20">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[34rem] overflow-hidden">
            <motion.div
              initial="hidden"
              animate={introState}
              variants={circleVariants}
              className="absolute left-1/2 top-[48%] aspect-square w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-hero-pink"
            />
            <motion.div
              initial="hidden"
              animate={introState}
              variants={portraitVariants}
              className="absolute inset-x-[-10%] bottom-0 top-0"
            >
              <Image
                src="/ziyue-portrait.png"
                alt="Portrait of Ziyue Xu"
                fill
                priority
                className="object-contain object-bottom"
                sizes="(max-width: 1099px) 92vw, 0px"
              />
            </motion.div>
          </div>

          <div>
            <div className="mb-5 flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-hero-pink sm:text-sm">
                About Me
              </span>
              <span className="h-px flex-1 bg-hero-pink/40" />
            </div>
            <h1 className="text-balance text-[clamp(2.75rem,13vw,5rem)] font-black uppercase leading-[0.88] tracking-tighter text-hero-pink">
              {TITLE_LINES.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <div className="mt-6 max-w-2xl space-y-3 text-[clamp(1rem,2.4vw,1.125rem)] leading-relaxed text-hero-muted">
              <p>
                Hi, I&apos;m Ziyue Xu — an AI and data science explorer with a background in
                applied mathematics and systems engineering.
              </p>
              <p>
                I build analytical workflows, machine learning models, and visual prototypes
                that connect technical depth with real-world execution — from healthcare
                intelligence to logistics optimization.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            {TAGLINE.map((word) => (
              <span
                key={word}
                className="bg-hero-pink px-3 py-1 text-[clamp(1.75rem,8vw,3.75rem)] font-black uppercase leading-none tracking-tighter text-hero-ink"
              >
                {word}
              </span>
            ))}
          </div>

          <div>
            <div className="mb-6 flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-hero-pink sm:text-sm">
                Education
              </span>
              <span className="h-px flex-1 bg-hero-pink/40" />
            </div>
            <ul className="grid gap-7 md:grid-cols-2 md:gap-10">
              {EDUCATION.map((edu) => (
                <li key={edu.school}>
                  <span className="font-mono text-xs uppercase tracking-widest text-hero-pink">
                    {edu.year}
                  </span>
                  <p className="mt-1 text-[clamp(1.5rem,5vw,2rem)] font-black uppercase leading-tight tracking-tight text-hero-ink">
                    {edu.school}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-hero-muted sm:text-base">{edu.detail}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-6 flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-hero-pink sm:text-sm">
                Skills &amp; Tools
              </span>
              <span className="h-px flex-1 bg-hero-pink/40" />
            </div>
            <div className="flex flex-wrap gap-2.5">
              {SKILLS.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => setActiveSkill(skill)}
                  aria-pressed={activeSkill === skill}
                  className={`rounded-full border px-3.5 py-2 font-mono text-sm font-semibold transition-colors ${
                    activeSkill === skill
                      ? 'border-hero-pink bg-hero-pink text-hero-card'
                      : 'border-hero-pink/70 text-hero-pink'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>
        <KeywordMarquee />
      </div>

      {/* nav anchor for the second (Education / Skills) view */}
      <span id="about" className="hero-desktop absolute top-[100vh]" aria-hidden="true" />

      {/* pinned viewport */}
      <div className="hero-desktop screen-dynamic sticky top-0 h-screen overflow-hidden pt-24 md:pt-28">
        <div className="mx-auto grid h-[calc(100vh-6rem)] max-w-[1600px] items-center gap-8 px-5 md:px-10 lg:grid-cols-[0.7fr_1.6fr_0.7fr] lg:gap-2">
          {/* Left column — two panels: About Me → Education */}
          <div className="relative order-2 h-full overflow-x-visible overflow-y-hidden lg:order-1">
            <div className="flex h-[200%] flex-col" style={slide}>
              {/* Panel 1 — About Me */}
              <div className="flex h-1/2 flex-col justify-center">
                <div>
                  <div className="mb-4 flex items-center gap-4 xl:mb-6">
                    <motion.span
                      initial="hidden"
                      animate={introState}
                      variants={aboutLabelVariants}
                      className="text-sm font-bold uppercase tracking-[0.25em] text-hero-pink"
                    >
                      About Me
                    </motion.span>
                    <motion.span
                      initial="hidden"
                      animate={introState}
                      variants={aboutLineVariants}
                      className="h-px flex-1 origin-left bg-hero-pink/40"
                    />
                  </div>
                  <h1 className="text-balance text-[clamp(2.35rem,3.7vw,3.75rem)] font-black uppercase leading-[0.9] tracking-tighter text-hero-pink">
                    {TITLE_LINES.map((line, index) => (
                      <motion.span
                        key={line}
                        custom={index}
                        initial="hidden"
                        animate={introState}
                        variants={titleLineVariants}
                        className="block"
                      >
                        {line}
                      </motion.span>
                    ))}
                  </h1>
                  <motion.div
                    initial="hidden"
                    animate={introState}
                    variants={introParagraphVariants}
                    className="mt-4 max-w-md space-y-2 text-sm leading-relaxed text-hero-muted min-[1440px]:mt-6 min-[1440px]:space-y-3 min-[1440px]:text-base min-[1600px]:text-lg"
                  >
                    <p>
                      Hi, I&apos;m Ziyue Xu — an AI and data science explorer with a background in
                      applied mathematics and systems engineering.
                    </p>
                    <p>
                      I build analytical workflows, machine learning models, and visual prototypes
                      that connect technical depth with real-world execution — from healthcare
                      intelligence to logistics optimization.
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Panel 2 — Education */}
              <div className="flex h-1/2 flex-col justify-center">
                <div className="mb-8 flex items-center gap-4">
                  <span className="text-sm font-bold uppercase tracking-[0.25em] text-hero-pink">
                    Education
                  </span>
                  <span className="h-px flex-1 bg-hero-pink/40" />
                </div>
                <ul className="space-y-8">
                  {EDUCATION.map((edu) => (
                    <li key={edu.school}>
                      <span className="font-mono text-xs uppercase tracking-widest text-hero-pink">
                        {edu.year}
                      </span>
                      <p className="mt-1 text-2xl font-black uppercase leading-tight tracking-tight text-hero-ink md:text-3xl">
                        {edu.school}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-hero-muted">{edu.detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Center — pinned portrait on pink circle (never moves) */}
          <div className="order-1 flex h-full justify-center self-end lg:order-2">
            <div className="relative flex h-full min-h-[520px] w-full max-w-3xl items-end justify-center">
              <motion.div
                initial="hidden"
                animate={introState}
                variants={circleVariants}
                className="absolute left-1/2 top-1/2 aspect-square w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-hero-pink"
              />
              <motion.div
                initial="hidden"
                animate={introState}
                variants={portraitVariants}
                className="absolute bottom-0 left-1/2 z-10 h-full w-[132%] -translate-x-1/2"
              >
                <Image
                  src="/ziyue-portrait.png"
                  alt="Portrait of Ziyue Xu"
                  fill
                  priority
                  className="object-contain object-bottom"
                  sizes="(max-width: 1024px) 95vw, 65vw"
                />
              </motion.div>
            </div>
          </div>

          {/* Right column — two panels: Tagline → Skills & Tools */}
          <div className="relative order-3 h-full overflow-x-visible overflow-y-hidden">
            <div className="flex h-[200%] flex-col" style={slide}>
              {/* Panel 1 — Tagline */}
              <div className="flex h-1/2 flex-col justify-center">
                <div className="flex flex-col items-start gap-2 lg:items-end">
                  {TAGLINE.map((word, index) => (
                    <motion.span
                      key={word}
                      custom={index}
                      initial="hidden"
                      animate={introState}
                      variants={taglineVariants}
                      className="bg-hero-pink px-3 py-1 text-[clamp(3rem,4.5vw,4.5rem)] font-black uppercase leading-none tracking-tighter text-hero-ink xl:px-4"
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Panel 2 — Skills & Tools */}
              <div className="flex h-1/2 flex-col justify-center lg:text-right">
                <div className="mb-8 flex items-center gap-4 lg:flex-row-reverse">
                  <span className="text-sm font-bold uppercase tracking-[0.25em] text-hero-pink">
                    Skills &amp; Tools
                  </span>
                  <span className="h-px flex-1 bg-hero-pink/40" />
                </div>
                <div className="flex flex-wrap gap-2.5 lg:justify-end">
                  {SKILLS.map((skill) => {
                    const isActive = activeSkill === skill
                    return (
                      <button
                        key={skill}
                        type="button"
                        onMouseEnter={() => setActiveSkill(skill)}
                        onFocus={() => setActiveSkill(skill)}
                        aria-pressed={isActive}
                        className={`rounded-full border px-3.5 py-1.5 font-mono text-sm font-semibold transition-all duration-200 ${
                          isActive
                            ? 'border-hero-pink bg-hero-pink text-hero-card shadow-[0_8px_20px_rgba(222,89,143,0.28)]'
                            : 'border-hero-pink/70 bg-transparent text-hero-pink hover:-translate-y-0.5 hover:border-hero-pink hover:bg-hero-pink/12'
                        }`}
                      >
                        {skill}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* progress dots — lifted above the anchored marquee */}
        <div className="absolute bottom-20 left-1/2 flex -translate-x-1/2 gap-2">
          <span
            className={`size-2.5 rounded-full transition-colors ${progress < 0.5 ? 'bg-hero-pink' : 'bg-hero-pink/30'}`}
          />
          <span
            className={`size-2.5 rounded-full transition-colors ${progress >= 0.5 ? 'bg-hero-pink' : 'bg-hero-pink/30'}`}
          />
        </div>

        {/* keyword ticker — anchored to the bottom of the pinned About viewport */}
        <div className="absolute inset-x-0 bottom-0 z-20">
          <KeywordMarquee />
        </div>
      </div>
    </section>
  )
}
