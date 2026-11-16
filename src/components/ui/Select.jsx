import { useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn.js';
import FieldLabel from './FieldLabel.jsx';

export default function Select({
  id,
  label,
  value,
  onChange,
  options = [],
  disabled = false,
  className,
  ...props
}) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>}

      <div className="relative">
        <select
          id={fieldId}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="h-11 w-full appearance-none rounded-field border border-[#26262A] bg-[#0F0F10] px-3.5 pr-10 text-sm text-text transition focus:border-primary/70 focus:outline-none focus:ring-2 focus:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-60"
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
