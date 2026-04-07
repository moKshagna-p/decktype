import { splitProps, type JSX } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { cn } from '@/lib/cn'

type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'link'
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

type ButtonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  as?: keyof JSX.IntrinsicElements | any
  class?: string
  children?: any
  [key: string]: any
}

const variantClassMap: Record<ButtonVariant, string> = {
  solid:
    'bg-(--sub-alt)/40 text-(--sub) hover:text-(--text) hover:bg-(--sub-alt)/60',
  outline:
    'border border-(--sub)/35 text-(--sub) hover:text-(--text) hover:border-(--sub)/60',
  ghost: 'text-(--sub) hover:text-(--text) hover:bg-(--sub-alt)/30',
  link: 'text-(--sub) underline-offset-4 hover:underline hover:text-(--text) p-0 h-auto',
}

const sizeClassMap: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 t-caption rounded-md',
  md: 'px-4 py-2 t-emphasis rounded-lg',
  lg: 'px-6 py-3 t-emphasis rounded-xl',
  icon: 'p-2 rounded-lg',
}

export function Button(props: ButtonProps) {
  const [local, rest] = splitProps(props, ['class', 'variant', 'size', 'as', 'children'])

  return (
    <Dynamic
      component={local.as ?? 'button'}
      {...rest}
      class={cn(
        'inline-flex items-center justify-center font-medium transition disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
        variantClassMap[local.variant ?? 'solid'],
        sizeClassMap[local.size ?? 'md'],
        local.class,
      )}
    >
      {local.children}
    </Dynamic>
  )
}

export default Button
