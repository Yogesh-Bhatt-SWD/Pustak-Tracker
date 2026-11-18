import type { InputHTMLAttributes } from 'react'

export default function Input({
  label,
  className,
  ...props
}: {
  label?: string
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      {label ? (
        <div className="text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </div>
      ) : null}
      <input
        className={[
          'input-field',
          className ?? '',
        ].join(' ')}
        {...props}
      />
    </label>
  )
}
