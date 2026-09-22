'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Goal, Plus } from 'lucide-react';

const funds = [
  { id: 1, name: 'Team Outing', goal: '₦100,000', raised: '₦85,000', contributors: 5 },
  { id: 2, name: 'Office Party', goal: '₦50,000', raised: '₦30,000', contributors: 3 },
];

export default function FundsPage() {
  return (
    <div className="space-y-6 px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Group Funds</h1>
        <Link href="/funds/create">
          <Button size="sm" className="bg-primary hover:bg-primary/90 gap-2">
            <Plus className="w-4 h-4" />
            New
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {funds.length > 0 ? (
          funds.map((fund) => {
            const progress = (parseInt(fund.raised.replace(/[₦,]/g, '')) / 
                            parseInt(fund.goal.replace(/[₦,]/g, ''))) * 100;
            return (
              <Link key={fund.id} href={`/funds/${fund.id}`}>
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Goal className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{fund.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {fund.contributors} contributors
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-2">
                        {fund.raised} / {fund.goal}
                      </p>
                      <Progress value={progress} className="h-2" />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })
        ) : (
          <Card className="p-12 text-center bg-muted/30">
            <Goal className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No funds yet</h3>
            <p className="text-muted-foreground mb-4">
              Create a group fund for a shared goal
            </p>
            <Link href="/funds/create">
              <Button className="bg-primary hover:bg-primary/90">
                Create Fund
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
