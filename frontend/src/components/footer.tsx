import { Kbd } from '@/components/ui/kbd'

export function Footer() {
  return (
    <footer class="grid h-12 w-full grid-cols-3 items-center px-6 text-(--sub)">
      <div class="flex items-center gap-6">
        <a href="#" class="hover:text-(--text)"><span class="text-xs leading-tight">contact</span></a>
        <a href="#" class="hover:text-(--text)"><span class="text-xs leading-tight">support</span></a>
        <a href="#" class="hover:text-(--text)"><span class="text-xs leading-tight">github</span></a>
        <a href="#" class="hover:text-(--text)"><span class="text-xs leading-tight">discord</span></a>
      </div>

      <div class="flex items-center justify-center gap-2">
        <div class="flex items-center gap-1">
          <Kbd>ctrl</Kbd>
          <span class="text-xs">/</span>
          <Kbd>cmd</Kbd>
          <span class="text-xs">+</span>
          <Kbd>k</Kbd>
        </div>
        <span class="text-xs">-</span>
        <span class="text-xs leading-tight">command line</span>
      </div>

      <div class="flex justify-end">
        <span class="text-xs leading-tight">v1.0.0</span>
      </div>
    </footer>
  )
}
