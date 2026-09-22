'use client';

import { Card } from '@/components/ui/card';
import { Shield, Eye, Lock } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Secure & Transparent',
    description: 'All transactions are recorded and visible to group members',
  },
  {
    icon: Lock,
    title: 'Your Control',
    description: 'You retain full control of your funds at all times',
  },
  {
    icon: Eye,
    title: 'Full Visibility',
    description: 'See every transaction and payment in real-time',
  },
];

export default function SecuritySection() {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground text-pretty">
            Security &amp; Transparency
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Your trust is our foundation. Complete transparency in every transaction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="p-8 bg-card">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-pretty">
                    {feature.description}
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
