'use client'

import { useLanguage } from './language-provider'

export function LanguageBanner() {
  const { lang, setLang } = useLanguage()
  if (lang !== 'zh') return null

  return (
    <div className="fixed inset-x-0 top-[calc(env(safe-area-inset-top,0px)+3.75rem)] z-40 border-b border-primary/40 bg-primary text-primary-foreground">
      <div className="mx-auto flex min-h-[2.375rem] max-w-[1400px] items-center justify-between gap-3 px-5 py-1.5 md:px-10">
        <p className="min-w-0 text-pretty font-mono text-[11px] leading-tight tracking-tight sm:text-xs">
          {'// 中文版本即将上线 — Chinese version coming soon. Showing English for now.'}
        </p>
        <button
          type="button"
          onClick={() => setLang('en')}
          className="shrink-0 font-mono text-xs font-bold uppercase tracking-widest underline underline-offset-4"
        >
          Back to EN
        </button>
      </div>
    </div>
  )
}
