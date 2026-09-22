'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { ArrowRight } from 'lucide-react';

const LottieAnimation = dynamic(() => import('@/components/lottie-player'), {
  loading: () => <div className="w-full h-96 bg-muted animate-pulse rounded-lg" />,
  ssr: false,
});

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-background via-background to-background">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Content */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground text-pretty">
              Save together. Save smarter.
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 text-pretty">
              Community-powered savings circles designed for everyone. Build wealth together with friends, family, and neighbors.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link href="/signup">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2"
              >
                Start Saving
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-primary text-primary hover:bg-primary/5"
              >
                Create a Circle
              </Button>
            </Link>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap gap-6 justify-center lg:justify-start text-sm text-muted-foreground pt-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>100% secure &amp; transparent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>No fees</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>Your money, your control</span>
            </div>
          </div>
        </div>

        {/* Right side - Animation */}
        <div className="relative h-96 lg:h-full flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-3xl blur-3xl opacity-50" />
          <div className="relative z-10 w-full h-96">
            <LottieAnimation animationData="/animations/hero-animation.json" />
          </div>
        </div>
      </div>
    </section>
  );
}
