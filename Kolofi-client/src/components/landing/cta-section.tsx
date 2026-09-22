'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-20 px-4 bg-primary">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-4xl lg:text-5xl font-bold text-primary-foreground text-pretty">
            Ready to Start Saving?
          </h2>
          <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto text-pretty">
            Join thousands of people building wealth together. No signup fees. No hidden costs.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-primary-foreground hover:bg-primary-foreground/90 text-primary font-semibold gap-2"
            >
              Create Your Account
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
            >
              Learn More
            </Button>
          </Link>
        </div>

        <div className="pt-8 border-t border-primary-foreground/20 space-y-4">
          <p className="text-sm text-primary-foreground/80">
            Questions? We're here to help.
          </p>
          <Link href="mailto:support@kolofi.com" className="text-primary-foreground hover:underline font-semibold">
            Contact us
          </Link>
        </div>
      </div>
    </section>
  );
}
