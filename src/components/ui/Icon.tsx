/**
 * Icon Component - GitHub Universe Design System
 * Wrapper for Primer Octicons with consistent sizing
 * 
 * Features:
 * - Functional icons: 16px (download, arrow-right, chevron-down, x, info, success, error)
 * - Branded icons: 30px (mark-github, linkedin)
 * - Consistent colors based on context
 */

import type { JSX } from 'preact';

interface IconProps {
  /** Icon name */
  name: string;

  /** Icon size */
  size?: 'functional' | 'branded' | number;

  /** Icon color */
  color?: string;

  /** Custom class names */
  className?: string;

  /** Accessible label */
  label?: string;
}

/**
 * Icon component - renders SVG icons from Primer Octicons
 * 
 * For full implementation, you'll need to:
 * 1. Install @primer/octicons-react: npm install @primer/octicons-react
 * 2. Import specific icons as needed
 * 
 * This is a basic wrapper that provides sizing and color consistency
 */
export function Icon({
  name,
  size = 'functional',
  color = 'currentColor',
  className = '',
  label,
}: IconProps) {
  const iconSize = typeof size === 'number' ? size : size === 'branded' ? 30 : 16;

  const iconClasses = [
    'inline-block',
    'flex-shrink-0',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Common icons as inline SVGs
  const renderIcon = () => {
    switch (name) {
      case 'x':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill={color}
            className={iconClasses}
            style={{ width: iconSize, height: iconSize }}
            aria-label={label}
            role={label ? 'img' : undefined}
          >
            <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
          </svg>
        );

      case 'download':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill={color}
            className={iconClasses}
            style={{ width: iconSize, height: iconSize }}
            aria-label={label}
            role={label ? 'img' : undefined}
          >
            <path d="M2.75 14A1.75 1.75 0 0 1 1 12.25v-2.5a.75.75 0 0 1 1.5 0v2.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-2.5a.75.75 0 0 1 1.5 0v2.5A1.75 1.75 0 0 1 13.25 14Z" />
            <path d="M7.25 7.689V2a.75.75 0 0 1 1.5 0v5.689l1.97-1.969a.749.749 0 1 1 1.06 1.06l-3.25 3.25a.749.749 0 0 1-1.06 0L4.22 6.78a.749.749 0 1 1 1.06-1.06l1.97 1.969Z" />
          </svg>
        );

      case 'arrow-right':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill={color}
            className={iconClasses}
            style={{ width: iconSize, height: iconSize }}
            aria-label={label}
            role={label ? 'img' : undefined}
          >
            <path d="M8.22 2.97a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042l2.97-2.97H3.75a.75.75 0 0 1 0-1.5h7.44L8.22 4.03a.75.75 0 0 1 0-1.06Z" />
          </svg>
        );

      case 'chevron-down':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill={color}
            className={iconClasses}
            style={{ width: iconSize, height: iconSize }}
            aria-label={label}
            role={label ? 'img' : undefined}
          >
            <path d="M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z" />
          </svg>
        );

      case 'info':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill={color}
            className={iconClasses}
            style={{ width: iconSize, height: iconSize }}
            aria-label={label}
            role={label ? 'img' : undefined}
          >
            <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
          </svg>
        );

      case 'check':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill={color}
            className={iconClasses}
            style={{ width: iconSize, height: iconSize }}
            aria-label={label}
            role={label ? 'img' : undefined}
          >
            <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
          </svg>
        );

      case 'alert':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill={color}
            className={iconClasses}
            style={{ width: iconSize, height: iconSize }}
            aria-label={label}
            role={label ? 'img' : undefined}
          >
            <path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
          </svg>
        );

      case 'mark-github':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill={color}
            className={iconClasses}
            style={{ width: iconSize, height: iconSize }}
            aria-label={label}
            role={label ? 'img' : undefined}
          >
            <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
          </svg>
        );

      case 'repo-forked':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill={color}
            className={iconClasses}
            style={{ width: iconSize, height: iconSize }}
            aria-label={label}
            role={label ? 'img' : undefined}
          >
            <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
          </svg>
        );

      case 'repo':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill={color}
            className={iconClasses}
            style={{ width: iconSize, height: iconSize }}
            aria-label={label}
            role={label ? 'img' : undefined}
          >
            <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
          </svg>
        );

      case 'people':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill={color}
            className={iconClasses}
            style={{ width: iconSize, height: iconSize }}
            aria-label={label}
            role={label ? 'img' : undefined}
          >
            <path d="M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4 4 0 0 0-7.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.493 3.493 0 0 1 2 5.5ZM11 4a3.001 3.001 0 0 1 2.22 5.018 5.01 5.01 0 0 1 2.56 3.012.749.749 0 0 1-.885.954.752.752 0 0 1-.549-.514 3.507 3.507 0 0 0-2.522-2.372.75.75 0 0 1-.574-.73v-.352a.75.75 0 0 1 .416-.672A1.5 1.5 0 0 0 11 5.5.75.75 0 0 1 11 4Zm-5.5-.5a2 2 0 1 0-.001 3.999A2 2 0 0 0 5.5 3.5Z" />
          </svg>
        );

      case 'star':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill={color}
            className={iconClasses}
            style={{ width: iconSize, height: iconSize }}
            aria-label={label}
            role={label ? 'img' : undefined}
          >
            <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z" />
          </svg>
        );

      case 'stack':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill={color}
            className={iconClasses}
            style={{ width: iconSize, height: iconSize }}
            aria-label={label}
            role={label ? 'img' : undefined}
          >
            <path d="M7.122.392a1.75 1.75 0 0 1 1.756 0l5.25 3.045c.54.313.872.89.872 1.514V7.5a.75.75 0 0 1-1.5 0V5.677L8.75 8.499v6.503a.75.75 0 0 1-1.5 0V8.5L2.5 5.677v5.42l4.75 2.76a.75.75 0 0 1-.75 1.296l-5.25-3.045A1.75 1.75 0 0 1 .378 10.594V4.951c0-.624.332-1.2.872-1.514ZM7.875 1.69a.25.25 0 0 0-.25 0L2.5 4.677 8 7.823l5.5-3.146-5.625-3.986ZM2.5 13.677v-2.3L6.5 13.8v2.3Z" />
          </svg>
        );

      case 'code':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill={color}
            className={iconClasses}
            style={{ width: iconSize, height: iconSize }}
            aria-label={label}
            role={label ? 'img' : undefined}
          >
            <path d="m11.28 3.22 4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L13.94 8l-3.72-3.72a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215Zm-6.56 0a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L2.06 8l3.72 3.72a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L.47 8.53a.75.75 0 0 1 0-1.06Z" />
          </svg>
        );

      case 'briefcase':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill={color}
            className={iconClasses}
            style={{ width: iconSize, height: iconSize }}
            aria-label={label}
            role={label ? 'img' : undefined}
          >
            <path d="M6.75 0h2.5C10.216 0 11 .784 11 1.75V3h3.25c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 14.25 15H1.75A1.75 1.75 0 0 1 0 13.25v-8.5C0 3.784.784 3 1.75 3H5V1.75C5 .784 5.784 0 6.75 0Zm0 1.5a.25.25 0 0 0-.25.25V3h3V1.75a.25.25 0 0 0-.25-.25h-2.5ZM1.75 4.5a.25.25 0 0 0-.25.25V6h13V4.75a.25.25 0 0 0-.25-.25H1.75ZM14.5 7.5h-13v5.75c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V7.5Z" />
          </svg>
        );

      case 'languages-mastered':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill={color}
            className={iconClasses}
            style={{ width: iconSize, height: iconSize }}
            aria-label={label}
            role={label ? 'img' : undefined}
          >
            <path d="M14.4394 3.04563C14.6025 2.66491 14.4262 2.224 14.0454 2.06083C13.6647 1.89767 13.2238 2.07403 13.0606 2.45475L8.56064 12.9548C8.39748 13.3355 8.57384 13.7764 8.95456 13.9396C9.33528 14.1027 9.77619 13.9264 9.93936 13.5456L14.4394 3.04563Z" />
            <path d="M5.5 11.5002C5.5 12.3286 4.82843 13.0002 4 13.0002C3.17157 13.0002 2.5 12.3286 2.5 11.5002C2.5 10.6718 3.17157 10.0002 4 10.0002C4.82843 10.0002 5.5 10.6718 5.5 11.5002Z" />
          </svg>
        );

      case 'down':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill={color}
            className={iconClasses}
            style={{ width: iconSize, height: iconSize }}
            aria-label={label}
            role={label ? 'img' : undefined}
          >
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.7803 5.21967C13.0732 5.51256 13.0732 5.98744 12.7803 6.28033L8.53033 10.5303C8.23744 10.8232 7.76256 10.8232 7.46967 10.5303L3.21967 6.28033C2.92678 5.98744 2.92678 5.51256 3.21967 5.21967C3.51256 4.92678 3.98744 4.92678 4.28033 5.21967L8 8.93934L11.7197 5.21967C12.0126 4.92678 12.4874 4.92678 12.7803 5.21967Z" />
          </svg>
        );

      default:
        // Fallback for unknown icons
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill={color}
            className={iconClasses}
            style={{ width: iconSize, height: iconSize }}
            aria-label={label || 'icon'}
            role="img"
          >
            <circle cx="8" cy="8" r="6" />
          </svg>
        );
    }
  };

  return renderIcon();
}

// Pre-configured icon variants
export function FunctionalIcon(props: Omit<IconProps, 'size'>) {
  return <Icon {...props} size="functional" />;
}

export function BrandedIcon(props: Omit<IconProps, 'size'>) {
  return <Icon {...props} size="branded" />;
}
