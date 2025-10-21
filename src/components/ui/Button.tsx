/**
 * Button Component - GitHub Universe Design System
 * Based on PricingOptions components from https://githubuniverse.com/
 *
 * Features:
 * - Primary button: Green with dark green shadow and transforms
 * - Secondary button: Transparent with border and hover effects
 * - Monospace font with uppercase text and letter spacing
 * - GitHub Universe hover animations and shadows
 * - Box-shadow and transform effects on interaction
 */

import type { JSX, ComponentChildren } from "preact";
import styles from "./Button.module.css";

export interface ButtonProps {
  /** Button content */
  children?: ComponentChildren;

  /** Button variant */
  variant?: "primary" | "secondary";

  /** Button size - large for main CTAs, medium for actions */
  size?: "medium" | "large";

  /** Click handler */
  onClick?: () => void;

  /** Button type */
  type?: "button" | "submit" | "reset";

  /** Disabled state */
  disabled?: boolean;

  /** Full width button */
  fullWidth?: boolean;

  /** Custom class names */
  className?: string;

  /** Show icon on right */
  icon?: JSX.Element;
}

export function Button({
  children,
  variant = "primary",
  size = "medium",
  onClick,
  type = "button",
  disabled = false,
  fullWidth = false,
  className = "",
  icon,
}: ButtonProps) {
  // Combine CSS module classes
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {/* Button text with GitHub Universe styling */}
      <span>{children}</span>

      {/* Icon if provided */}
      {icon && <span className={styles.icon}>{icon as any}</span>}
    </button>
  );
}

// Pre-configured button variants for convenience
export function PrimaryButton(props: Omit<ButtonProps, "variant">) {
  return <Button {...props} variant="primary" />;
}

export function SecondaryButton(props: Omit<ButtonProps, "variant">) {
  return <Button {...props} variant="secondary" />;
}
