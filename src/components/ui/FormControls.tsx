/**
 * Form Controls - Primer Design System
 *
 * Components styled with @primer/react-brand CSS patterns
 * Provides Checkbox, TextInput, and PrimerSelect with Primer styling
 */

import type { JSX } from "preact";
import styles from "./FormControls.module.css";

interface CheckboxProps {
  /** Checkbox ID for label association */
  id: string;

  /** Checkbox label */
  label?: string;

  /** Checked state */
  checked?: boolean;

  /** Change handler */
  onChange?: (checked: boolean) => void;

  /** Disabled state */
  disabled?: boolean;

  /** Custom class names */
  className?: string;
}

export function Checkbox({
  label,
  checked = false,
  onChange,
  disabled = false,
  className = "",
  id,
}: CheckboxProps) {
  return (
    <label className={`${styles["checkbox-wrapper"]} ${className}`}>
      <input
        type="checkbox"
        className={styles["checkbox-input"]}
        checked={checked}
        onChange={(e) => onChange?.(e.currentTarget.checked)}
        disabled={disabled}
      />

      <div className={styles.checkbox}>
        <svg
          className={styles["checkbox-checkmark"]}
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M4 8l2.5 2.5L12 5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {label && (
        <span className="text-sm font-medium cursor-pointer">
          {label}
        </span>
      )}
    </label>
  );
}

interface TextInputProps {
  /** Input label */
  label?: string;

  /** Input value */
  value?: string;

  /** Change handler */
  onChange?: (value: string) => void;

  /** Input handler for real-time updates */
  onInput?: (event: any) => void;

  /** Placeholder text */
  placeholder?: string;

  /** Input type */
  type?: "text" | "email" | "password" | "url";

  /** Disabled state */
  disabled?: boolean;

  /** Error state */
  error?: boolean;

  /** Error message to display */
  errorMessage?: string;

  /** Success state */
  success?: boolean;

  /** Size variant */
  size?: "medium" | "large";

  /** Custom class names */
  className?: string;

  /** Input ID */
  id?: string;
}

export function TextInput({
  label,
  value,
  onChange,
  onInput,
  placeholder,
  type = "text",
  disabled = false,
  error = false,
  errorMessage,
  success = false,
  size = "medium",
  className = "",
  id,
}: TextInputProps) {
  const wrapperClasses = [
    styles["textinput-wrapper"],
    styles[`textinput-wrapper--${size}`],
    disabled && styles["textinput-wrapper--disabled"],
    error && styles["textinput-wrapper--error"],
    success && styles["textinput-wrapper--success"],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.formControlWrap}>
      {label && (
        <label
          htmlFor={id}
          className={`${styles.label} ${disabled ? styles["label--disabled"] : ""
            }`}
        >
          {label}
        </label>
      )}
      <div className={wrapperClasses}>
        <input
          id={id}
          type={type}
          value={value}
          onChange={
            onChange
              ? (e) => onChange((e.target as HTMLInputElement).value)
              : undefined
          }
          onInput={onInput}
          placeholder={placeholder}
          disabled={disabled}
          className={styles.textinput}
          aria-describedby={error ? "error" : undefined}
          aria-invalid={error}
        />
      </div>
      {error && (
        <span className={styles.errorMessage} id="error">
          <svg aria-hidden="true" focusable="false" class="octicon octicon-alert-fill" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" display="inline-block" overflow="visible" style="vertical-align: text-bottom;"><path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575ZM8 5a.75.75 0 0 0-.75.75v2.5a.75.75 0 0 0 1.5 0v-2.5A.75.75 0 0 0 8 5Zm1 6a1 1 0 1 0-2 0 1 1 0 0 0 2 0Z"></path></svg>
          {errorMessage}
        </span>
      )}
    </div>
  );
}

interface PrimerSelectProps {
  /** Select label */
  label?: string;

  /** Select value */
  value?: string;

  /** Change handler */
  onChange?: (value: string) => void;

  /** Placeholder text */
  placeholder?: string;

  /** Disabled state */
  disabled?: boolean;

  /** Error state */
  error?: boolean;

  /** Success state */
  success?: boolean;

  /** Size variant */
  size?: "medium" | "large";

  /** Full width */
  fullWidth?: boolean;

  /** Required field */
  required?: boolean;

  /** Custom class names */
  className?: string;

  /** Select ID */
  id?: string;

  /** Children (options) */
  children?: any;
}

export function PrimerSelect({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  error = false,
  success = false,
  size = "medium",
  fullWidth = true,
  required = false,
  className = "",
  id,
  children,
}: PrimerSelectProps) {
  const wrapperClasses = [
    styles["select-wrapper"],
    styles[`select-wrapper--${size}`],
    disabled && styles["select-wrapper--disabled"],
    error && styles["select-wrapper--error"],
    success && styles["select-wrapper--success"],
    fullWidth && styles["select-wrapper--fullWidth"],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className={`${styles.label} ${disabled ? styles["label--disabled"] : ""
            }`}
        >
          {label}
        </label>
      )}
      <span className={wrapperClasses}>
        <select
          id={id}
          value={value}
          onChange={
            onChange
              ? (e) => onChange((e.target as HTMLSelectElement).value)
              : undefined
          }
          disabled={disabled}
          required={required}
          className={`${styles.select} ${styles[`select--${size}`]}`}
          aria-invalid={error}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>
      </span>
    </div>
  );
}
