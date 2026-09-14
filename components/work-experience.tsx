'use client'

import { ExperienceGlobeFallback } from '@/components/experience-globe-fallback'
import { useSiteContent } from '@/components/site-content-provider'

export function WorkExperience() {
  const { workExperience } = useSiteContent()
  return (
    <section id="experience" className="scroll-mt-24 border-t-2 border-hero-pink/30 bg-[#120b12] py-20 text-hero-card md:py-28">
      <div className="mx-auto grid max-w-[1500px] gap-12 px-5 md:px-10 lg:grid-cols-[1.3fr_0.9fr] lg:gap-8">
        <div>
          <div className="mb-10 flex items-center gap-6">
            <span className="font-mono text-sm font-semibold uppercase tracking-[0.25em] text-hero-pink">
              Work Experience
            </span>
            <span className="h-px flex-1 bg-hero-pink/55" aria-hidden />
          </div>

          <h2 className="section-title-fluid text-pretty font-black tracking-tighter text-hero-pink">
            Where I&apos;ve built.
          </h2>

          <div className="mt-10 space-y-4">
            {workExperience.map((item) => (
              <article
                key={item.id}
                tabIndex={0}
                className="group rounded-2xl border border-hero-pink/30 bg-white/5 p-5 transition-colors duration-300 hover:border-hero-pink/65 hover:bg-white/8 focus-visible:border-hero-pink/65 focus-visible:outline-none"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-hero-pink/90">{item.period}</p>
                    <h3 className="mt-1 text-xl font-black tracking-tight text-hero-card md:text-2xl">
                      {item.role}
                    </h3>
                    <p className="mt-1 text-sm text-hero-card/75 md:text-base">{item.org}</p>
                  </div>
                  <span className="rounded-full border border-hero-pink/45 px-3 py-1 font-mono text-xs text-hero-pink/95">
                    {item.location}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-hero-card/80 md:text-base">{item.summary}</p>

                <ul className="mt-4 max-h-96 space-y-2 overflow-hidden text-sm text-hero-card/85 opacity-100 transition-all duration-500 md:max-h-0 md:opacity-0 md:group-hover:max-h-44 md:group-hover:opacity-100 md:group-focus-visible:max-h-44 md:group-focus-visible:opacity-100">
                  {item.details.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-hero-pink" aria-hidden />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>

        <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden sm:min-h-[480px] lg:min-h-[520px]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(65%_55%_at_52%_52%,rgba(222,89,143,0.22),rgba(18,11,18,0)_72%)]" aria-hidden />
          <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:repeating-linear-gradient(90deg,rgba(255,255,255,0.02)_0,rgba(255,255,255,0.02)_1px,transparent_1px,transparent_18px)]" aria-hidden />
          <div className="relative w-full max-w-[620px]">
            <ExperienceGlobeFallback />
          </div>
        </div>
      </div>
    </section>
  )
}
