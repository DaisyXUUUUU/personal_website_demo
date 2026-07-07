'use client'

import Image from 'next/image'

const TAGLINE = ['From', 'Insight', 'To', 'Impact']

export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen overflow-hidden bg-hero-bg pt-24 text-hero-ink md:pt-28"
    >
      <div className="mx-auto grid max-w-[1600px] items-center gap-8 px-5 pb-20 pt-8 md:px-10 lg:grid-cols-[0.7fr_1.6fr_0.7fr] lg:gap-2 lg:pb-0">
        {/* Left — about me copy */}
        <div className="hero-anim-rise order-2 [animation-delay:0.8s] lg:order-1">
          <div className="mb-6 flex items-center gap-4">
            <span className="text-sm font-bold uppercase tracking-[0.25em] text-hero-pink">
              About Me
            </span>
            <span className="h-px flex-1 bg-hero-pink/40" />
          </div>

          <h1 className="text-balance text-6xl font-black uppercase leading-[0.9] tracking-tighter text-hero-pink md:text-7xl lg:text-[5.5rem]">
            Global
            <br />
            thinking.
            <br />
            Applied
            <br />
            rigor.
          </h1>

          <div className="mt-8 max-w-md space-y-4 text-lg leading-relaxed text-hero-muted">
            <p>
              Hi, I&apos;m Ziyue Xu — a First-Class Honours applied mathematician who turns
              uncertainty into decisions.
            </p>
            <p>
              With a background spanning the UK and China, I specialize in stochastic modeling,
              tail-risk analytics and large-scale optimization — always paired with clean,
              reproducible Python so the math ships into the real world.
            </p>
          </div>
        </div>

        {/* Center — portrait layered ON TOP of a pink circle (circle is just a backdrop) */}
        <div className="order-1 flex justify-center self-end lg:order-2">
          <div className="relative flex w-full max-w-2xl items-end justify-center">
            {/* pink circle backdrop */}
            <div className="hero-anim-circle absolute left-1/2 top-0 aspect-square w-[92%] -translate-x-1/2 rounded-full bg-hero-pink [animation-delay:0.1s]" />
            {/* portrait cutout, overflowing the circle */}
            <div className="hero-anim-rise relative z-10 aspect-[4/5] w-full [animation-delay:0.5s]">
              <Image
                src="/ziyue-portrait.png"
                alt="Portrait of Ziyue Xu"
                fill
                priority
                className="scale-105 object-contain object-bottom"
                sizes="(max-width: 1024px) 95vw, 55vw"
              />
            </div>
          </div>
        </div>

        {/* Right — tagline blocks */}
        <div className="hero-anim-rise order-3 flex flex-col items-start gap-2 [animation-delay:0.95s] lg:items-end">
          {TAGLINE.map((word) => (
            <span
              key={word}
              className="bg-hero-pink px-4 py-1 text-6xl font-black uppercase leading-none tracking-tighter text-hero-ink md:text-7xl lg:text-8xl"
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#experience"
        aria-label="Scroll to experience"
        className="absolute bottom-6 left-1/2 flex size-10 -translate-x-1/2 items-center justify-center rounded-full border-2 border-hero-pink"
      >
        <span className="size-2.5 animate-bounce rounded-full bg-hero-pink" />
      </a>
    </section>
  )
}
