import { splitProps, type JSX } from 'solid-js'

import { cn } from '@/lib/cn'

type ButtonVariant = 'solid' | 'outline' | 'ghost'
type ButtonSize = 'md' | 'lg'

type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

const variantClassMap: Record<ButtonVariant, string> = {
  solid:
    'bg-[color:color-mix(in_srgb,var(--sub-alt)_90%,var(--bg))] text-[var(--sub)] hover:text-[var(--text)]',
  outline:
    'border border-[var(--sub)]/35 text-[var(--sub)] hover:text-[var(--text)]',
  ghost: 'text-[var(--sub)] hover:text-[var(--text)]',
}

const sizeClassMap: Record<ButtonSize, string> = {
  md: 'px-4 py-2 text-base',
  lg: 'px-4 py-3 text-lg',
}

function Button(props: ButtonProps) {
  const [local, rest] = splitProps(props, ['class', 'variant', 'size'])

  return (
    <button
      {...rest}
      class={cn(
        'rounded-lg font-semibold transition disabled:cursor-not-allowed disabled:opacity-60',
        variantClassMap[local.variant ?? 'solid'],
        sizeClassMap[local.size ?? 'md'],
        local.class,
      )}
    />
  )
}

export default Button
