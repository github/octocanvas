/**
 * Label Component - GitHub Universe Design System
 * Based on Figma specifications for Theme and Topic labels
 * 
 * Features:
 * - Theme labels (Build, Secure, Automate)
 * - Topic labels (custom topics)
 * - Monaspace Neon uppercase text
 * - 24px height with 8px padding
 * - Hover and selected states
 */

import type { JSX } from 'preact';

export interface LabelProps {
  /** Label text */
  children: string;

  /** Label type */
  variant?: 'theme' | 'topic';

  /** Theme type (for theme labels) */
  theme?: 'build' | 'secure' | 'automate';

  /** Selected state */
  selected?: boolean;

  /** Click handler */
  onClick?: () => void;

  /** Mode - light or dark background */
  mode?: 'light' | 'dark';

  /** Custom class names */
  className?: string;
}

export function Label({
  children,
  variant = 'topic',
  theme,
  selected = false,
  onClick,
  mode = 'dark',
  className = '',
}: LabelProps) {
  const isInteractive = !!onClick;

  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'px-2',
    'py-[7px]',
    'h-[24px]',
    'font-mono',
    'font-medium',
    'text-body-sm',
    'uppercase',
    'tracking-wide',
    'rounded',
    'transition-all',
    'duration-200',
    isInteractive ? 'cursor-pointer' : '',
  ].filter(Boolean).join(' ');

  // Variant-specific styling
  const variantClasses = (() => {
    if (variant === 'theme') {
      // Theme labels have no background, just text colors
      if (selected) {
        return 'text-black bg-transparent';
      }
      return 'text-universe-grey-6 hover:text-black bg-transparent';
    } else {
      // Topic labels on light backgrounds
      if (mode === 'light') {
        if (selected) {
          return 'bg-black text-white';
        }
        return [
          'bg-transparent',
          'text-universe-grey-6',
          'border',
          'border-universe-border-light',
          'hover:bg-universe-grey-1',
          'hover:text-black',
          'hover:border-black',
        ].join(' ');
      }
      // Topic labels on dark backgrounds
      if (selected) {
        return 'bg-white text-black';
      }
      return [
        'bg-transparent',
        'text-universe-grey-6',
        'border',
        'border-universe-border-dark',
        'hover:bg-universe-grey-8',
        'hover:text-white',
        'hover:border-white',
      ].join(' ');
    }
  })();

  const allClasses = `${baseClasses} ${variantClasses} ${className}`;

  const Component = isInteractive ? 'button' : 'span';

  return (
    <Component
      className={allClasses}
      onClick={onClick}
      type={isInteractive ? 'button' : undefined}
      aria-pressed={isInteractive && selected ? true : undefined}
    >
      {children}
    </Component>
  );
}

// Pre-configured label variants
export function ThemeLabel(props: Omit<LabelProps, 'variant'>) {
  return <Label {...props} variant="theme" />;
}

export function TopicLabel(props: Omit<LabelProps, 'variant'>) {
  return <Label {...props} variant="topic" />;
}
