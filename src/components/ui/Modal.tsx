/**
 * Modal Component - GitHub Universe Design System
 * Based on Figma specifications
 * 
 * Features:
 * - Backdrop blur (37.5px)
 * - Proper spacing (32px padding mobile, 80px desktop)
 * - Close button (X icon)
 * - Desktop/Mobile responsive
 */

import type { JSX } from 'preact';
import { useEffect } from 'preact/hooks';

interface ModalProps {
  /** Modal visibility */
  isOpen: boolean;

  /** Close handler */
  onClose: () => void;

  /** Modal title */
  title?: string;

  /** Modal content */
  children: JSX.Element | JSX.Element[] | string;

  /** Size variant */
  size?: 'sm' | 'md' | 'lg';

  /** Custom class names */
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className = '',
}: ModalProps) {
  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
  }[size];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/70"
        style={{ backdropFilter: 'blur(37.5px)' }}
      />

      {/* Modal container */}
      <div
        className={[
          'relative',
          'w-full',
          sizeClasses,
          'bg-universe-grey-9',
          'rounded-lg',
          'shadow-2xl',
          'px-8 py-8',
          'md:px-20 md:py-20',
          'max-h-[90vh]',
          'overflow-y-auto',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          className="absolute top-6 right-6 text-universe-grey-4 hover:text-white transition-colors"
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Title */}
        {title && (
          <h2
            id="modal-title"
            className="text-h4-desktop md:text-h3-desktop font-display font-semibold text-white mb-6 pr-8"
          >
            {title}
          </h2>
        )}

        {/* Content */}
        <div className="text-universe-grey-1">
          {children}
        </div>
      </div>
    </div>
  );
}

// Pre-configured modal sizes
export function SmallModal(props: Omit<ModalProps, 'size'>) {
  return <Modal {...props} size="sm" />;
}

export function MediumModal(props: Omit<ModalProps, 'size'>) {
  return <Modal {...props} size="md" />;
}

export function LargeModal(props: Omit<ModalProps, 'size'>) {
  return <Modal {...props} size="lg" />;
}
