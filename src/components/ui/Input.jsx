import { useId } from 'react';
import { cn } from '../../utils/cn.js';
import FieldLabel from './FieldLabel.jsx';

export default function Input({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  hint,
  icon: Icon,
  autoComplete,
  disabled = false,
  required = false,
  inputMode,
  className,
  ...props
}) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const errorId = `${fieldId}-error`;
  const hintId = `${fieldId}-hint`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>}

      <div className="relative">
        {Icon && (
          <Icon
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
            aria-hidden="true"
          />
        )}
        <input
          id={fieldId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          required={required}
          inputMode={inputMode}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          className={cn(
            'h-11 w-full rounded-field border bg-[#0F0F10] px-3.5 text-sm text-text transition placeholder:text-text-muted focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60',
            Icon && 'pl-10',
            error
              ? 'border-danger/60 focus:border-danger focus:ring-danger/25'
              : 'border-[#26262A] focus:border-primary/70 focus:ring-primary/25',
          )}
          {...props}
        />
      </div>

      {error ? (
        <p id={errorId} className="text-xs text-danger">
          {error}
        </p>
      ) : (
        hint && (
          <p id={hintId} className="text-xs text-text-muted">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
