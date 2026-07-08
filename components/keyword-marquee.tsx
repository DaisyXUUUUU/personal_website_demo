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
  'UK × China',
]

export function KeywordMarquee() {
  // Duplicated once so the -50% translate loops seamlessly
  const items = [...KEYWORDS, ...KEYWORDS]

  return (
    <div
      className="overflow-hidden border-y-2 border-hero-pink/40 bg-hero-ink py-5"
      role="marquee"
      aria-label="Keywords"
    >
      <div className="marquee-track flex w-max items-center whitespace-nowrap">
        {items.map((word, i) => (
          <span key={i} className="flex items-center" aria-hidden={i >= KEYWORDS.length}>
            <span className="px-8 text-2xl font-black uppercase tracking-tight text-hero-pink md:text-3xl">
              {word}
            </span>
            <span className="text-2xl text-hero-pink/40 md:text-3xl" aria-hidden="true">
              {'✦'}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
