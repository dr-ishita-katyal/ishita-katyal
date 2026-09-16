import { useId } from 'react';

export function Field({ label, hint, error, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="field-label">{label}</span>
      {children}
      {hint && !error && <span className="mt-1.5 block text-[0.72rem] leading-snug text-clay">{hint}</span>}
      {error && <span className="mt-1.5 block text-[0.72rem] text-red-600">{error}</span>}
    </label>
  );
}

export function TextInput({ label, hint, error, className, ...props }) {
  return (
    <Field label={label} hint={hint} error={error} className={className}>
      <input className="field-input" {...props} />
    </Field>
  );
}

export function TextArea({ label, hint, error, rows = 4, className, ...props }) {
  return (
    <Field label={label} hint={hint} error={error} className={className}>
      <textarea rows={rows} className="field-input resize-y leading-relaxed" {...props} />
    </Field>
  );
}

export function Select({ label, hint, error, options = [], className, ...props }) {
  return (
    <Field label={label} hint={hint} error={error} className={className}>
      <select className="field-input" {...props}>
        {options.map((o) => (
          <option key={o.value ?? o} value={o.value ?? o}>
            {o.label ?? o}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function Toggle({ label, hint, checked, onChange, name }) {
  const id = useId();
  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={Boolean(checked)}
        name={name}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full border transition-colors duration-300 ${
          checked ? 'border-umber bg-umber' : 'border-line bg-linen'
        }`}
      >
        <span
          className={`absolute top-[3px] h-4 w-4 rounded-full bg-cream shadow-sm transition-transform duration-300 ${
            checked ? 'translate-x-[22px]' : 'translate-x-[3px]'
          }`}
        />
      </button>
      <label htmlFor={id} className="cursor-pointer select-none">
        <span className="block text-[0.9rem] font-medium text-ink">{label}</span>
        {hint && <span className="mt-0.5 block text-[0.72rem] leading-snug text-clay">{hint}</span>}
      </label>
    </div>
  );
}
