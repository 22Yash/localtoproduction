import React from 'react';

interface PillProps {
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'accent' | 'tint' | 'outline';
  className?: string;
}

export function Pill({
  label,
  icon,
  variant = 'default',
  className = '',
}: PillProps): React.JSX.Element {
  const variantStyles = {
    default: 'bg-surface text-ink border-ink',
    accent: 'bg-accent text-ink border-ink shadow-hard',
    tint: 'bg-tint text-ink border-ink',
    outline: 'bg-transparent text-ink border-divider',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono border rounded-lg ${variantStyles} ${className}`}
    >
      {icon && <span className="w-3.5 h-3.5 flex items-center justify-center">{icon}</span>}
      <span>{label}</span>
    </span>
  );
}
