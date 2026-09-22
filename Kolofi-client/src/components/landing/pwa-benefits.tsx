'use client';

import { Card } from '@/components/ui/card';
import { Smartphone, Zap, Download } from 'lucide-react';

const benefits = [
  {
    icon: Download,
    title: 'Install on Home Screen',
    description: 'Add Kolofi to your phone like a native app',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized for speed, works offline',
  },
  {
    icon: Smartphone,
    title: 'Mobile First',
    description: 'Perfect experience on any device',
  },
];

export default function PWABenefits() {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground text-pretty">
            Built for Mobile
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Optimized for your phone. Install it like an app and use it offline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card key={index} className="p-8 bg-card">
                <div className="space-y-4 text-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground text-pretty">
                    {benefit.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
