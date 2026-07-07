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
