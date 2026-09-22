'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Check } from 'lucide-react';

const notifications = [
  {
    id: 1,
    type: 'payout',
    title: 'Your payout is ready!',
    message: 'Friends Circle has completed your payout round',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 2,
    type: 'contribution',
    title: 'Reminder: Contribution due',
    message: 'Your monthly contribution of ₦15,000 is due today',
    time: '6 hours ago',
    read: false,
  },
  {
    id: 3,
    type: 'achievement',
    title: 'You hit your goal!',
    message: 'Congratulations! Your emergency fund has reached ₦100,000',
    time: '1 day ago',
    read: true,
  },
  {
    id: 4,
    type: 'member',
    title: 'New member joined',
    message: 'John joined the Team Outing fund',
    time: '2 days ago',
    read: true,
  },
];

export default function NotificationsPage() {
  return (
    <div className="space-y-6 px-4 py-6">
      <h1 className="text-3xl font-bold text-foreground">Notifications</h1>

      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <Card
              key={notif.id}
              className={`p-4 transition-colors ${
                !notif.read ? 'bg-primary/5 border-primary/20' : 'bg-card'
              }`}
            >
              <div className="flex gap-4">
                <div className="p-2 bg-primary/10 rounded-lg h-fit">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-foreground">
                      {notif.title}
                    </h3>
                    {!notif.read && (
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notif.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {notif.time}
                  </p>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center bg-muted/30">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No notifications
            </h3>
            <p className="text-muted-foreground">
              You're all caught up!
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
