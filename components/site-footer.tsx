export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-[1400px] px-5 py-10 md:px-10">
        <div className="flex flex-col gap-8 border-b border-border pb-10 md:flex-row md:items-end md:justify-between">
          <p className="text-[16vw] font-black uppercase leading-[0.8] tracking-tighter text-outline-primary md:text-[9rem]">
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
          <span>© {new Date().getFullYear()} ziyue — AI Designer</span>
          <span>Designed &amp; built with intent</span>
        </div>
      </div>
    </footer>
  )
}
