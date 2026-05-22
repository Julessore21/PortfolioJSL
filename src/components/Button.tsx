import type { ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'tertiary'
type ButtonSize = 'default' | 'sm'

interface ButtonProps {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  href?: string
  onClick?: () => void
  className?: string
  disabled?: boolean
  'aria-label'?: string
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'btn-glass btn-glass--primary',
  secondary: 'btn-glass btn-glass--secondary',
  tertiary: 'btn-glass btn-glass--secondary',
}

const SIZE_CLASS: Record<ButtonSize, string> = {
  default: 'inline-flex items-center justify-center gap-2 px-7 py-3 text-sm',
  sm: 'inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm',
}

export function Button({
  children,
  variant = 'primary',
  size = 'default',
  href,
  onClick,
  className = '',
  disabled,
  'aria-label': ariaLabel,
}: ButtonProps) {
  const cls = `${VARIANT_CLASS[variant]} ${SIZE_CLASS[size]} ${className}`.trim()

  if (href) {
    return (
      <a href={href} className={cls} aria-label={ariaLabel}>
        {children}
      </a>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cls}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}
