import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type DashboardActionTileProps = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  iconClassName?: string;
};

export function DashboardActionTile({
  title,
  description,
  href,
  icon: Icon,
  iconClassName,
}: DashboardActionTileProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group rounded-xl border border-border/70 bg-card/70 p-4 backdrop-blur-sm',
        'transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg',
      )}
    >
      <div className="mb-3 inline-flex rounded-lg bg-primary/10 p-2 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className={cn('h-5 w-5', iconClassName)} />
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="mt-3 inline-flex items-center text-xs font-medium text-primary">
        Open
        <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
