'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export default function CreateFundPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    purpose: '',
    goalAmount: '',
    description: '',
    estimatedDate: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    console.log('Creating fund:', formData);
    router.push('/funds');
  };

  const progress = (step / 3) * 100;

  const purposes = [
    { id: 'wedding', label: 'Wedding' },
    { id: 'trip', label: 'Trip/Vacation' },
    { id: 'event', label: 'Event/Celebration' },
    { id: 'project', label: 'Project' },
    { id: 'other', label: 'Other' },
  ];

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground">Fund Name</label>
              <Input
                name="name"
                placeholder="e.g., Team Outing Fund"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Purpose</label>
              <div className="mt-3 space-y-2">
                {purposes.map(purpose => (
                  <Card
                    key={purpose.id}
                    className={`p-3 cursor-pointer transition-all border-2 ${
                      formData.purpose === purpose.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, purpose: purpose.id }))}
                  >
                    <p className="font-semibold text-foreground text-sm">{purpose.label}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground">Goal Amount</label>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-lg font-semibold text-foreground">₦</span>
                <Input
                  name="goalAmount"
                  type="number"
                  placeholder="100000"
                  value={formData.goalAmount}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Description</label>
              <textarea
                name="description"
                placeholder="Tell people what this fund is for..."
                value={formData.description}
                onChange={handleInputChange}
                className="mt-2 w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Estimated Target Date (Optional)</label>
              <Input
                name="estimatedDate"
                type="date"
                value={formData.estimatedDate}
                onChange={handleInputChange}
                className="mt-2"
              />
            </div>

            <Card className="p-6 bg-primary/5">
              <h3 className="text-lg font-bold text-foreground mb-4">Review Your Fund</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fund Name</span>
                  <span className="font-semibold text-foreground">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Purpose</span>
                  <span className="font-semibold text-foreground capitalize">{formData.purpose}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Goal Amount</span>
                  <span className="font-semibold text-foreground">₦{parseInt(formData.goalAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Target Date</span>
                  <span className="font-semibold text-foreground">
                    {formData.estimatedDate ? new Date(formData.estimatedDate).toLocaleDateString() : 'Flexible'}
                  </span>
                </div>
              </div>
            </Card>
            <p className="text-xs text-muted-foreground">
              You'll be able to invite contributors after creating the fund
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="px-4 py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Create Group Fund</h1>
        <p className="text-muted-foreground mt-1">Step {step} of 3</p>
      </div>

      <Progress value={progress} className="h-1" />

      <Card className="p-6">
        {renderStep()}
      </Card>

      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleBack}
          disabled={step === 1}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          className="flex-1 bg-primary hover:bg-primary/90"
          onClick={step === 3 ? handleSubmit : handleNext}
        >
          {step === 3 ? 'Create Fund' : (
            <>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
