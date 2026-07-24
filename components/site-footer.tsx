export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-[1400px] px-5 py-10 md:px-10">
        <div className="flex flex-col gap-8 border-b border-border pb-10 md:flex-row md:items-end md:justify-between">
          <p className="text-[clamp(3.5rem,16vw,9rem)] font-black uppercase leading-[0.8] tracking-tighter text-outline-primary">
            ziyue®
          </p>
          <a
            href="#top"
            className="w-fit font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
          >
            ↑ Back to top
          </a>
        </div>
        <div className="flex flex-col gap-2 pt-6 font-mono text-xs uppercase tracking-widest text-muted-foreground md:flex-row md:justify-between">
          <span>© {new Date().getFullYear()} Ziyue Xu — An AI and Data Science Explorer</span>
          <span>Built with intent · Ningbo, China</span>
        </div>
      </div>
    </footer>
  )
}
