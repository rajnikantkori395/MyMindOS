import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type DashboardStatTileProps = {
  label: string;
  value: string;
  icon: LucideIcon;
  accentClassName?: string;
};

export function DashboardStatTile({
  label,
  value,
  icon: Icon,
  accentClassName,
}: DashboardStatTileProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border/70 bg-card/80 p-4',
        'transition-all duration-300 hover:border-primary/50 hover:shadow-md',
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className={cn('rounded-md bg-primary/10 p-2 text-primary', accentClassName)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
    </div>
  );
}
