import { LanguageProvider } from '@/components/language-provider'
import { LanguageBanner } from '@/components/language-banner'
import { SiteNav } from '@/components/site-nav'
import { Hero } from '@/components/hero'
import { WorkExperience } from '@/components/work-experience'
import { Experience } from '@/components/experience'
import { Human } from '@/components/human'
import { Contact } from '@/components/contact'
import { SiteFooter } from '@/components/site-footer'
import { SplashGate } from '@/components/splash-gate'
import { GrainOverlay } from '@/components/grain-overlay'

export default function Page() {
  return (
    <SplashGate>
      <LanguageProvider>
        <GrainOverlay />
        <SiteNav />
        <LanguageBanner />
        <main>
          <Hero />
          <WorkExperience />
          <Experience />
          <Human />
          <Contact />
        </main>
        <SiteFooter />
      </LanguageProvider>
    </SplashGate>
  )
}
