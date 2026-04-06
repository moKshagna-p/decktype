import { splitProps, type JSX } from 'solid-js'

import { cn } from '@/lib/cn'

type InputProps = JSX.InputHTMLAttributes<HTMLInputElement>

function Input(props: InputProps) {
  const [local, rest] = splitProps(props, ['class'])

  return (
    <input
      {...rest}
      class={cn(
        'rounded-lg bg-[var(--sub-alt)] px-4 py-3 text-base text-[var(--text)] outline-none placeholder:text-[var(--sub)] focus:bg-[color:color-mix(in_srgb,var(--sub-alt)_80%,var(--bg))]',
        local.class,
      )}
    />
  )
}

export default Input
