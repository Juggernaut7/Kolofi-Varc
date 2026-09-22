'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Users, Target, Goal, Check, ChevronRight } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Choose Your Saving Mode',
    description: 'Pick how you want to save',
    modes: [
      {
        icon: Users,
        title: 'Savings Circle',
        description: 'Save with friends in rotation',
        action: 'Start a Circle',
      },
      {
        icon: Target,
        title: 'Solo Vault',
        description: 'Personal savings goal',
        action: 'Create Vault',
      },
      {
        icon: Goal,
        title: 'Group Fund',
        description: 'Save for shared goal',
        action: 'Create Fund',
      },
    ],
  },
  {
    id: 2,
    title: 'Connect Your Wallet',
    description: 'Link where your savings go',
    info: 'Choose your preferred wallet provider',
  },
  {
    id: 3,
    title: 'Enable Notifications',
    description: 'Stay updated on your savings',
    info: 'Get reminders for contributions and payouts',
  },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    // Redirect to dashboard
    window.location.href = '/dashboard';
  };

  const step = steps[currentStep - 1];
  const progress = (currentStep / steps.length) * 100;

  if (currentStep === 1) {
    return (
      <div className="min-h-screen bg-background px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">
                {step.title}
              </h1>
              <span className="text-sm text-muted-foreground">
                Step {currentStep}/{steps.length}
              </span>
            </div>
            <Progress value={progress} className="h-1" />
          </div>

          <p className="text-muted-foreground">{step.description}</p>

          {/* Mode Selection */}
          <div className="space-y-4 pt-6">
            {step.modes?.map((mode) => {
              const Icon = mode.icon;
              return (
                <Card
                  key={mode.title}
                  className={`p-6 cursor-pointer transition-all border-2 ${
                    selectedMode === mode.title
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedMode(mode.title)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">
                          {mode.title}
                        </h3>
                        <p className="text-muted-foreground mt-1">
                          {mode.description}
                        </p>
                      </div>
                    </div>
                    {selectedMode === mode.title && (
                      <Check className="w-6 h-6 text-primary flex-shrink-0" />
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* CTA */}
          <div className="pt-8 space-y-3">
            <Button
              className="w-full bg-primary hover:bg-primary/90 gap-2 text-lg py-6"
              disabled={!selectedMode}
              onClick={handleNext}
            >
              Continue <ChevronRight className="w-5 h-5" />
            </Button>
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full">
                Skip for now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 2) {
    return (
      <div className="min-h-screen bg-background px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">
                {step.title}
              </h1>
              <span className="text-sm text-muted-foreground">
                Step {currentStep}/{steps.length}
              </span>
            </div>
            <Progress value={progress} className="h-1" />
          </div>

          <p className="text-muted-foreground">{step.description}</p>

          {/* Wallet Options */}
          <div className="space-y-3 pt-6">
            {['Solana Wallet', 'MetaMask', 'Phantom'].map((wallet) => (
              <Card key={wallet} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">{wallet}</h3>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="pt-8 space-y-3">
            <Button
              className="w-full bg-primary hover:bg-primary/90 gap-2 text-lg py-6"
              onClick={handleNext}
            >
              Connect Wallet <ChevronRight className="w-5 h-5" />
            </Button>
            <Button variant="outline" className="w-full">
              Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3 - Notifications
  return (
    <div className="min-h-screen bg-background px-4 py-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">
              {step.title}
            </h1>
            <span className="text-sm text-muted-foreground">
              Step {currentStep}/{steps.length}
            </span>
          </div>
          <Progress value={progress} className="h-1" />
        </div>

        <p className="text-muted-foreground">{step.description}</p>

        {/* Notification Options */}
        <div className="space-y-3 pt-6">
          <Card className="p-4 border-primary bg-primary/5">
            <div className="flex items-start gap-4">
              <input
                type="checkbox"
                checked
                readOnly
                className="w-5 h-5 accent-primary mt-1"
              />
              <div>
                <h3 className="font-semibold text-foreground">
                  Contribution Reminders
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Get reminded before your contribution is due
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-border">
            <div className="flex items-start gap-4">
              <input
                type="checkbox"
                checked
                readOnly
                className="w-5 h-5 accent-primary mt-1"
              />
              <div>
                <h3 className="font-semibold text-foreground">
                  Payout Notifications
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Know when your payout is ready to claim
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-border">
            <div className="flex items-start gap-4">
              <input
                type="checkbox"
                checked
                readOnly
                className="w-5 h-5 accent-primary mt-1"
              />
              <div>
                <h3 className="font-semibold text-foreground">
                  Goal Milestones
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Celebrate when you hit savings goals
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* CTA */}
        <div className="pt-8 space-y-3">
          <Button
            className="w-full bg-primary hover:bg-primary/90 gap-2 text-lg py-6"
            onClick={handleComplete}
          >
            Get Started <ChevronRight className="w-5 h-5" />
          </Button>
          <Button variant="outline" className="w-full">
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}
