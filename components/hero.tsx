'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const TAGLINE = ['From', 'Insight', 'To', 'Impact']

const EDUCATION = [
  {
    year: '2021 — 2025',
    school: 'University of Nottingham',
    detail:
      'BSc Mathematics with Applied Mathematics · First-Class Honours · GPA 3.9/4.0 · Ningbo CN & Nottingham UK',
  },
  {
    year: 'Coursework',
    school: 'Applied & Computational',
    detail:
      'Probability Models · Statistical Methods · Optimization · Scientific Computation & Numerical Analysis · Data Modelling',
  },
]

const SKILLS = [
  { name: 'Python', level: 95 },
  { name: 'SQL', level: 85 },
  { name: 'R', level: 82 },
  { name: 'MATLAB', level: 80 },
  { name: 'Tableau', level: 84 },
  { name: 'C++ / LaTeX', level: 72 },
]

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)

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

  // Each side column holds two stacked full-height panels; slide up by one panel.
  const slide = { transform: `translateY(${-progress * 50}%)` }

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative h-[200vh] bg-hero-bg text-hero-ink"
    >
      {/* nav anchor for the second (Education / Skills) view */}
      <span id="about" className="absolute top-[100vh]" aria-hidden="true" />

      {/* pinned viewport */}
      <div className="sticky top-0 h-screen overflow-hidden pt-24 md:pt-28">
        <div className="mx-auto grid h-[calc(100vh-6rem)] max-w-[1600px] items-center gap-8 px-5 md:px-10 lg:grid-cols-[0.7fr_1.6fr_0.7fr] lg:gap-2">
          {/* Left column — two panels: About Me → Education */}
          <div className="relative order-2 h-full overflow-hidden lg:order-1">
            <div className="flex h-[200%] flex-col" style={slide}>
              {/* Panel 1 — About Me */}
              <div className="flex h-1/2 flex-col justify-center">
                <div className="hero-anim-rise [animation-delay:0.8s]">
                  <div className="mb-6 flex items-center gap-4">
                    <span className="text-sm font-bold uppercase tracking-[0.25em] text-hero-pink">
                      About Me
                    </span>
                    <span className="h-px flex-1 bg-hero-pink/40" />
                  </div>
                  <h1 className="text-balance text-5xl font-black uppercase leading-[0.9] tracking-tighter text-hero-pink md:text-6xl lg:text-7xl">
                    Global
                    <br />
                    thinking.
                    <br />
                    Applied
                    <br />
                    rigor.
                  </h1>
                  <div className="mt-6 max-w-md space-y-3 text-base leading-relaxed text-hero-muted lg:text-lg">
                    <p>
                      Hi, I&apos;m Ziyue Xu — a First-Class Honours applied mathematician who turns
                      uncertainty into decisions.
                    </p>
                    <p>
                      Spanning the UK and China, I specialize in stochastic modeling, tail-risk
                      analytics and large-scale optimization — always shipped as clean,
                      reproducible Python.
                    </p>
                  </div>
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
              <div className="hero-anim-circle absolute left-1/2 top-1/2 aspect-square w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-hero-pink [animation-delay:0.1s]" />
              <div className="hero-anim-rise absolute bottom-0 left-1/2 z-10 h-full w-[132%] -translate-x-1/2 [animation-delay:0.5s]">
                <Image
                  src="/ziyue-portrait.png"
                  alt="Portrait of Ziyue Xu"
                  fill
                  priority
                  className="object-contain object-bottom"
                  sizes="(max-width: 1024px) 95vw, 65vw"
                />
              </div>
            </div>
          </div>

          {/* Right column — two panels: Tagline → Skills & Tools */}
          <div className="relative order-3 h-full overflow-hidden">
            <div className="flex h-[200%] flex-col" style={slide}>
              {/* Panel 1 — Tagline */}
              <div className="flex h-1/2 flex-col justify-center">
                <div className="hero-anim-rise flex flex-col items-start gap-2 [animation-delay:0.95s] lg:items-end">
                  {TAGLINE.map((word) => (
                    <span
                      key={word}
                      className="bg-hero-pink px-4 py-1 text-5xl font-black uppercase leading-none tracking-tighter text-hero-ink md:text-6xl lg:text-7xl"
                    >
                      {word}
                    </span>
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
                <div className="space-y-5">
                  {SKILLS.map((skill) => (
                    <div key={skill.name}>
                      <div className="mb-2 flex items-baseline justify-between font-mono text-xs uppercase tracking-widest">
                        <span className="font-bold text-hero-ink">{skill.name}</span>
                        <span className="text-hero-muted">{skill.level}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-hero-pink/20">
                        <div
                          className="h-full rounded-full bg-hero-pink"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* progress dots */}
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          <span
            className={`size-2.5 rounded-full transition-colors ${progress < 0.5 ? 'bg-hero-pink' : 'bg-hero-pink/30'}`}
          />
          <span
            className={`size-2.5 rounded-full transition-colors ${progress >= 0.5 ? 'bg-hero-pink' : 'bg-hero-pink/30'}`}
          />
        </div>
      </div>
    </section>
  )
}
