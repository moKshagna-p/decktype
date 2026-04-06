import { splitProps, type JSX } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { cn } from '@/lib/cn'

type CardProps = {
  as?: keyof JSX.IntrinsicElements | any
  class?: string
  children?: any
  [key: string]: any
}

export function Card(props: CardProps) {
  const [local, rest] = splitProps(props, ['as', 'class', 'children'])

  return (
    <Dynamic
      component={local.as ?? 'div'}
      {...rest}
      class={cn(
        'rounded-2xl p-6 bg-(--sub-alt) transition-all',
        local.class,
      )}
    >
      {local.children}
    </Dynamic>
  )
}
