'use client'

import Image from 'next/image'

const TAGLINE = ['From', 'Insight', 'To', 'Impact']

export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen overflow-hidden bg-hero-bg pt-24 text-hero-ink md:pt-28"
    >
      <div className="mx-auto grid max-w-[1600px] items-center gap-10 px-5 pb-20 pt-8 md:px-10 lg:grid-cols-[1fr_0.9fr_0.8fr] lg:gap-6 lg:pb-8">
        {/* Left — about me copy */}
        <div className="order-2 lg:order-1">
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

        {/* Center — portrait on pink circle */}
        <div className="order-1 flex justify-center lg:order-2">
          <div className="relative flex aspect-square w-full max-w-md items-end justify-center">
            <div className="absolute inset-x-4 bottom-0 top-4 rounded-full bg-hero-pink" />
            <div className="relative h-[115%] w-full">
              <Image
                src="/ziyue-portrait.png"
                alt="Portrait of Ziyue Xu"
                fill
                priority
                className="object-contain object-bottom"
                sizes="(max-width: 1024px) 90vw, 40vw"
              />
            </div>
          </div>
        </div>

        {/* Right — tagline blocks */}
        <div className="order-3 flex flex-col items-start gap-2 lg:items-end">
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
