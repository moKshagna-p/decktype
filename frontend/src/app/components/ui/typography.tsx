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

type TypographyColor = 'main' | 'text' | 'sub' | 'error' | 'success' | 'none'
type TypographyWeight = 'normal' | 'medium' | 'semibold' | 'bold'
type TypographyTracking = 'normal' | 'tight' | 'wide' | 'widest'

type TypographyProps = {
  variant?: TypographyVariant
  as?: keyof JSX.IntrinsicElements | any
  weight?: TypographyWeight
  color?: TypographyColor
  tracking?: TypographyTracking
  uppercase?: boolean
  truncate?: boolean
  italic?: boolean
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

const colorClassMap: Record<TypographyColor, string> = {
  main: 'text-(--main)',
  text: 'text-(--text)',
  sub: 'text-(--sub)',
  error: 'text-(--error)',
  success: 'text-(--success)',
  none: '',
}

const weightClassMap: Record<TypographyWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
}

const trackingClassMap: Record<TypographyTracking, string> = {
  normal: 'tracking-normal',
  tight: 'tracking-tight',
  wide: 'tracking-wide',
  widest: 'tracking-[0.16em]',
}

type VariantDefaults = {
  color?: TypographyColor
  weight?: TypographyWeight
  tracking?: TypographyTracking
  uppercase?: boolean
}

const variantDefaults: Record<TypographyVariant, VariantDefaults> = {
  label: { color: 'sub', weight: 'semibold', uppercase: true, tracking: 'widest' },
  caption: { color: 'sub' },
  body: { color: 'text' },
  emphasis: { color: 'text', weight: 'medium' },
  title: { color: 'text', weight: 'bold' },
  'page-title': { color: 'text', weight: 'bold' },
  metric: { color: 'text', weight: 'bold' },
  display: { color: 'text', weight: 'bold' },
  word: { color: 'text' },
}

export function Typography(props: TypographyProps) {
  const [local, rest] = splitProps(props, [
    'variant',
    'as',
    'weight',
    'color',
    'tracking',
    'uppercase',
    'truncate',
    'italic',
    'class',
    'children'
  ])

  const variant = local.variant ?? 'body'
  const defaults = variantDefaults[variant]

  const color = local.color ?? defaults.color
  const weight = local.weight ?? defaults.weight
  const tracking = local.tracking ?? defaults.tracking
  const uppercase = local.uppercase ?? defaults.uppercase

  return (
    <Dynamic
      component={local.as ?? 'div'}
      {...rest}
      class={cn(
        variantClassMap[variant],
        color && colorClassMap[color],
        weight && weightClassMap[weight],
        tracking && trackingClassMap[tracking],
        uppercase && 'uppercase',
        local.truncate && 'truncate',
        local.italic && 'italic',
        local.class,
      )}
    >
      {local.children}
    </Dynamic>
  )
}
