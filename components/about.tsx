'use client'

import Image from 'next/image'

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

export function About() {
  return (
    <section
      id="about"
      className="relative min-h-screen overflow-hidden border-t border-hero-pink/20 bg-hero-bg py-20 text-hero-ink"
    >
      <div className="mx-auto grid max-w-[1600px] items-center gap-8 px-5 md:px-10 lg:min-h-[calc(100vh-10rem)] lg:grid-cols-[0.8fr_1.5fr_0.8fr] lg:gap-2">
        {/* Left — Education */}
        <div className="hero-anim-rise order-2 [animation-delay:0.8s] lg:order-1">
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

        {/* Center — portrait layered ON TOP of a pink circle (shared with Hero) */}
        <div className="order-1 flex justify-center self-end lg:order-2 lg:h-full">
          <div className="relative flex h-full min-h-[520px] w-full max-w-3xl items-end justify-center">
            <div className="hero-anim-circle absolute left-1/2 top-1/2 aspect-square w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-hero-pink [animation-delay:0.1s]" />
            <div className="hero-anim-rise absolute bottom-0 left-1/2 z-10 h-full w-[132%] -translate-x-1/2 [animation-delay:0.5s]">
              <Image
                src="/ziyue-portrait.png"
                alt="Portrait of Ziyue Xu"
                fill
                className="object-contain object-bottom"
                sizes="(max-width: 1024px) 95vw, 60vw"
              />
            </div>
          </div>
        </div>

        {/* Right — Skills & Tools */}
        <div className="hero-anim-rise order-3 [animation-delay:0.95s] lg:text-right">
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
    </section>
  )
}

export function SectionHeader({ index, title }: { index: string; title: string }) {
  return (
    <div className="mb-12 flex items-end justify-between gap-4 border-b border-border pb-4">
      <h2 className="flex items-baseline gap-4 text-5xl font-black uppercase tracking-tighter md:text-7xl">
        <span className="font-mono text-base font-normal text-primary md:text-lg">{index}</span>
        {title}
      </h2>
      <span className="hidden font-mono text-xs uppercase tracking-widest text-muted-foreground md:block">
        [ scroll ↓ ]
      </span>
    </div>
  )
}
