import { splitProps, type JSX } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { cn } from '@/lib/cn'

type CardVariant = 'default' | 'muted' | 'outline' | 'ghost'

type CardProps = {
  variant?: CardVariant
  as?: keyof JSX.IntrinsicElements | any
  hoverable?: boolean
  class?: string
  children?: any
  [key: string]: any
}

const variantClassMap: Record<CardVariant, string> = {
  default: 'bg-(--sub-alt)/35',
  muted: 'bg-(--sub-alt)/20',
  outline: 'border border-(--sub)/25',
  ghost: 'bg-transparent',
}

export function Card(props: CardProps) {
  const [local, rest] = splitProps(props, ['variant', 'as', 'class', 'hoverable', 'children'])

  return (
    <Dynamic
      component={local.as ?? 'div'}
      {...rest}
      class={cn(
        'rounded-2xl p-6 transition-all',
        variantClassMap[local.variant ?? 'default'],
        local.hoverable && 'hover:bg-(--sub-alt)/50 hover:-translate-y-0.5 cursor-pointer',
        local.class,
      )}
    >
      {local.children}
    </Dynamic>
  )
}
