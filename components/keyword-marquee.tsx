const KEYWORDS = [
  'AI & Data Science',
  'Machine Learning',
  'Real-World AI Systems',
  'Data → Decisions',
  'NLP & Intelligent Analytics',
  'Predictive Modeling',
  'Optimization',
  'Systems Engineering',
  'Reproducible Python',
]

export function KeywordMarquee() {
  // Duplicated once so the -50% translate loops seamlessly
  const items = [...KEYWORDS, ...KEYWORDS]

  return (
    <div
      className="overflow-hidden border-y-2 border-hero-pink/40 bg-hero-ink py-3 sm:py-5"
      role="marquee"
      aria-label="Keywords"
    >
      <div className="marquee-track flex w-max items-center whitespace-nowrap">
        {items.map((word, i) => (
          <span key={i} className="flex items-center" aria-hidden={i >= KEYWORDS.length}>
            <span className="px-5 text-xl font-black uppercase tracking-tight text-hero-pink sm:px-8 sm:text-2xl md:text-3xl">
              {word}
            </span>
            <span className="text-xl text-hero-pink/40 sm:text-2xl md:text-3xl" aria-hidden="true">
              {'✦'}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
