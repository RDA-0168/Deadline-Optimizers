import type { FittingStatus, ConditionStatus, MaintenanceStatus } from '../../types';

type BadgeVariant = 'active' | 'warning' | 'critical' | 'info' | 'gray';

function getVariant(value: string): BadgeVariant {
  const v = value.toLowerCase();
  if (v === 'active' || v === 'good' || v === 'completed' || v === 'excellent') return 'active';
  if (v.includes('due') || v.includes('attention') || v.includes('scheduled') || v === 'pending' || v === 'fair') return 'warning';
  if (v === 'critical' || v === 'overdue' || v === 'unreadable' || v === 'severe') return 'critical';
  if (v === 'in transit' || v === 'inspected' || v === 'supplied') return 'info';
  return 'gray';
}

interface StatusBadgeProps {
  status: FittingStatus | ConditionStatus | MaintenanceStatus | string;
  className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const variant = getVariant(status);

  const classes: Record<BadgeVariant, string> = {
    active: 'badge-active',
    warning: 'badge-warning',
    critical: 'badge-critical',
    info: 'badge-info',
    gray: 'badge-gray',
  };

  const dots: Record<BadgeVariant, string> = {
    active: 'bg-emerald-400',
    warning: 'bg-amber-400',
    critical: 'bg-red-400',
    info: 'bg-blue-400',
    gray: 'bg-gray-400',
  };

  return (
    <span className={`${classes[variant]} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[variant]} mr-1`} />
      {status}
    </span>
  );
}
