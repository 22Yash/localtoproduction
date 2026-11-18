import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export function Button({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  ...props
}: ButtonProps): React.JSX.Element {
  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3.5 py-1.5 text-xs font-semibold',
  }[size];

  const variantStyles = {
    primary:
      'bg-accent text-ink border-ink hover:bg-accent-hover shadow-hard active:translate-x-[1px] active:translate-y-[1px] active:shadow-none',
    secondary:
      'bg-surface text-ink border-ink hover:bg-tint active:bg-tint',
    ghost:
      'bg-transparent text-ink border-transparent hover:bg-tint/60',
  }[variant];

  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 font-mono border rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${sizeStyles} ${variantStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className="w-3.5 h-3.5 flex items-center justify-center">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className="w-3.5 h-3.5 flex items-center justify-center">{icon}</span>
      )}
    </button>
  );
}
