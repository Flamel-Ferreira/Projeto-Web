import { Check, Circle } from 'lucide-react';
import { PASSWORD_RULES, evaluatePassword } from '../../utils/validators.js';
import { cn } from '../../utils/cn.js';

const LEVELS = {
  weak: { bar: 'bg-danger', text: 'text-danger' },
  medium: { bar: 'bg-warning', text: 'text-warning' },
  strong: { bar: 'bg-success', text: 'text-success' },
};

export default function PasswordStrength({ password = '' }) {
  const { score, rules, strength, label } = evaluatePassword(password);
  const level = LEVELS[strength] ?? LEVELS.weak;
  const hasValue = String(password).length > 0;

  return (
    <div className="space-y-2" aria-live="polite">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] text-text-muted">Força da senha</span>
        <span
          className={cn(
            'text-[11px] font-medium',
            hasValue ? level.text : 'text-text-muted',
          )}
        >
          {label}
        </span>
      </div>

      <div className="flex gap-1" aria-hidden="true">
        {PASSWORD_RULES.map((rule, index) => (
          <span
            key={rule.key}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors duration-200',
              hasValue && index < score ? level.bar : 'bg-[#26262A]',
            )}
          />
        ))}
      </div>

      <ul className="grid grid-cols-1 gap-1 pt-0.5 sm:grid-cols-2">
        {PASSWORD_RULES.map((rule) => {
          const met = Boolean(rules[rule.key]);
          return (
            <li
              key={rule.key}
              className={cn(
                'flex items-center gap-1.5 text-[11px]',
                met ? 'text-success' : 'text-text-muted',
              )}
            >
              {met ? (
                <Check className="h-3 w-3 shrink-0" aria-hidden="true" />
              ) : (
                <Circle className="h-2 w-2 shrink-0" aria-hidden="true" />
              )}
              {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
