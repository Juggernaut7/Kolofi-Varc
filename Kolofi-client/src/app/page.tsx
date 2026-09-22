import { HeroSection } from '@/components/landing/hero'
import { HowItWorksSection } from '@/components/landing/how-it-works'
import { FeaturesSection } from '@/components/landing/features'
import { SecuritySection } from '@/components/landing/security'
import { CTASection } from '@/components/landing/cta'
import { LandingHeader } from '@/components/landing/header'
import { LandingFooter } from '@/components/landing/footer'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <LandingHeader />
      <main className="flex-1">
        <HeroSection />
        <HowItWorksSection />
        <FeaturesSection />
        <SecuritySection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  )
}
