'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

const modes = [
  {
    title: 'Savings Circles',
    description: 'Rotate payouts among group members',
    features: [
      'Save with friends & family',
      'Fair and transparent rotation',
      'Flexible group sizes',
      'Community accountability',
    ],
    icon: '👥',
  },
  {
    title: 'Solo Vaults',
    description: 'Personal savings goals with milestones',
    features: [
      'Set custom goal amounts',
      'Unlock by target date',
      'Track your progress',
      'Celebrate milestones',
    ],
    icon: '🎯',
  },
  {
    title: 'Group Funds',
    description: 'Save together for specific goals',
    features: [
      'Weddings, trips, celebrations',
      'Everyone contributes equally',
      'Clear goal tracking',
      'Distribute funds together',
    ],
    icon: '🎉',
  },
];

export default function SavingModes() {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground text-pretty">
            Three Ways to Save
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Choose the savings method that works best for you and your community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {modes.map((mode, index) => (
            <Card
              key={index}
              className="p-8 bg-card hover:shadow-lg transition-shadow hover:border-primary"
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="space-y-2">
                  <div className="text-4xl mb-4">{mode.icon}</div>
                  <h3 className="text-2xl font-bold text-foreground">
                    {mode.title}
                  </h3>
                  <p className="text-muted-foreground">{mode.description}</p>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  {mode.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-foreground/90">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
