import { splitProps, type JSX } from 'solid-js'
import { cn } from '@/lib/cn'

type BadgeVariant = 'default' | 'main' | 'success' | 'error' | 'sub'

type BadgeProps = JSX.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant
}

const variantClassMap: Record<BadgeVariant, string> = {
  default: 'bg-(--sub-alt) text-(--text)',
  main: 'bg-(--main)/20 text-(--main)',
  success: 'bg-(--success)/20 text-(--success)',
  error: 'bg-(--error)/20 text-(--error)',
  sub: 'bg-(--sub-alt)/50 text-(--sub)',
}

export function Badge(props: BadgeProps) {
  const [local, rest] = splitProps(props, ['variant', 'class', 'children'])

  return (
    <span
      {...rest}
      class={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 t-label font-bold uppercase tracking-wider',
        variantClassMap[local.variant ?? 'default'],
        local.class,
      )}
    >
      {local.children}
    </span>
  )
}
