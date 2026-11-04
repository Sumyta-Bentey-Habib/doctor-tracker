'use client';

import { Stethoscope, Users } from 'lucide-react';
import { DASHBOARD_STRINGS } from '@/utils';

interface DashboardStatsProps {
  totalDoctors?: number;
  totalPatients?: number;
}

export function DashboardStats({
  totalDoctors = 0,
  totalPatients = 0,
}: DashboardStatsProps) {
  const cards = [
    {
      title: DASHBOARD_STRINGS.statTotalDoctors,
      value: totalDoctors.toLocaleString(),
      subtitle: DASHBOARD_STRINGS.statTotalDoctorsSubtitle,
      icon: Stethoscope,
      iconBg: 'bg-primary/10 dark:bg-primary/20',
      iconColor: 'text-primary',
    },
    {
      title: DASHBOARD_STRINGS.statTotalPatients,
      value: totalPatients.toLocaleString(),
      subtitle: DASHBOARD_STRINGS.statTotalPatientsSubtitle,
      icon: Users,
      iconBg: 'bg-sky-500/10 dark:bg-sky-500/20',
      iconColor: 'text-sky-500',
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            key={card.title}
            className="group relative overflow-hidden rounded-3xl border border-border/70 bg-surface/85 p-6 shadow-card backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-secondary">
                {card.title}
              </span>

              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${card.iconBg} ${card.iconColor} transition-transform duration-300 group-hover:scale-105`}
              >
                <Icon size={21} strokeWidth={2.2} />
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                {card.value}
              </h3>
              <p className="mt-1.5 text-xs font-medium text-text-muted">
                {card.subtitle}
              </p>
            </div>
          </article>
        );
      })}
    </section>
  );
}
