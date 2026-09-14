'use client'

import { useEffect, useState } from 'react'
import { SiteContentProvider } from '@/components/site-content-provider'
import { LanguageProvider } from '@/components/language-provider'
import { GrainOverlay } from '@/components/grain-overlay'
import { SiteNav } from '@/components/site-nav'
import { Hero } from '@/components/hero'
import { WorkExperience } from '@/components/work-experience'
import { Experience } from '@/components/experience'
import { Human } from '@/components/human'
import { Contact } from '@/components/contact'
import { SiteFooter } from '@/components/site-footer'
import { validateSiteContent, type SiteContent } from '@/lib/site-content'

export function DraftPreview({ initialContent }: { initialContent: SiteContent }) {
  const [content, setContent] = useState(initialContent)

  useEffect(() => {
    const saved = window.localStorage.getItem('ziyue-portfolio-draft')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (validateSiteContent(parsed)) setContent(parsed)
      } catch {}
    }

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.data?.type !== 'ZIYUE_PREVIEW_CONTENT') return
      if (validateSiteContent(event.data.content)) setContent(event.data.content)
    }
    window.addEventListener('message', onMessage)
    window.parent.postMessage({ type: 'ZIYUE_PREVIEW_READY' }, window.location.origin)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  return (
    <SiteContentProvider content={content}>
      <LanguageProvider>
        <GrainOverlay />
        <SiteNav />
        <main>
          <Hero />
          <WorkExperience />
          <Experience />
          <Human />
          <Contact />
        </main>
        <SiteFooter />
      </LanguageProvider>
    </SiteContentProvider>
  )
}
