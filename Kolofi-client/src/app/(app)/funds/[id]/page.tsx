'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Goal, Users, TrendingUp, Banknote } from 'lucide-react';

export default function FundDetailPage({ params }: { params: { id: string } }) {
  const fund = {
    id: params.id,
    name: 'Team Outing Fund',
    purpose: 'Celebration trip for the whole team',
    goal: 100000,
    raised: 85000,
    contributors: [
      { id: 1, name: 'John Doe', avatar: 'JD', amount: 20000 },
      { id: 2, name: 'Jane Smith', avatar: 'JS', amount: 15000 },
      { id: 3, name: 'Mike Johnson', avatar: 'MJ', amount: 18000 },
      { id: 4, name: 'Sarah Lee', avatar: 'SL', amount: 16000 },
      { id: 5, name: 'Ahmed Hassan', avatar: 'AH', amount: 16000 },
    ],
  };

  const progress = (fund.raised / fund.goal) * 100;
  const remaining = fund.goal - fund.raised;

  return (
    <div className="space-y-6 px-4 py-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{fund.name}</h1>
        <p className="text-muted-foreground mt-1">{fund.purpose}</p>
      </div>

      {/* Main Progress Card */}
      <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-foreground/80 text-sm font-medium">Amount Raised</p>
              <h2 className="text-4xl font-bold">₦{fund.raised.toLocaleString()}</h2>
            </div>
            <div className="p-3 bg-primary-foreground/20 rounded-lg">
              <Banknote className="w-8 h-8" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="opacity-80">Progress to goal</span>
              <span className="font-semibold">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary-foreground/20">
            <div>
              <p className="text-xs opacity-80">Goal Amount</p>
              <p className="text-lg font-semibold">₦{fund.goal.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs opacity-80">Remaining</p>
              <p className="text-lg font-semibold">₦{remaining.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Contributors */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Contributors</h2>
          <span className="text-sm text-muted-foreground">
            {fund.contributors.length} people
          </span>
        </div>

        <div className="space-y-3">
          {fund.contributors.map((contributor) => (
            <Card key={contributor.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-muted text-muted-foreground text-sm font-bold">
                      {contributor.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground">{contributor.name}</h3>
                    <p className="text-xs text-muted-foreground">Contributed</p>
                  </div>
                </div>
                <p className="font-bold text-primary">₦{contributor.amount.toLocaleString()}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Button className="w-full bg-primary hover:bg-primary/90 py-6 text-lg">
          Contribute to Fund
        </Button>
        <Button variant="outline" className="w-full border-border py-6">
          View Details
        </Button>
      </div>
    </div>
  );
}
