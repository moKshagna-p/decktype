import { splitProps, type JSX } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { cn } from '@/lib/cn'

type TypographyVariant =
  | 'label'
  | 'caption'
  | 'body'
  | 'emphasis'
  | 'title'
  | 'page-title'
  | 'metric'
  | 'display'
  | 'word'

type TypographyProps = {
  variant?: TypographyVariant
  as?: keyof JSX.IntrinsicElements | any
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  class?: string
  children?: any
  [key: string]: any
}

const variantClassMap: Record<TypographyVariant, string> = {
  label: 't-label',
  caption: 't-caption',
  body: 't-body',
  emphasis: 't-emphasis',
  title: 't-title',
  'page-title': 't-page-title',
  metric: 't-metric',
  display: 't-display',
  word: 't-word',
}

const weightClassMap: Record<string, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
}

export function Typography(props: TypographyProps) {
  const [local, rest] = splitProps(props, ['variant', 'as', 'weight', 'class', 'children'])

  return (
    <Dynamic
      component={local.as ?? 'div'}
      {...rest}
      class={cn(
        variantClassMap[local.variant ?? 'body'],
        local.weight && weightClassMap[local.weight],
        local.class,
      )}
    >
      {local.children}
    </Dynamic>
  )
}
