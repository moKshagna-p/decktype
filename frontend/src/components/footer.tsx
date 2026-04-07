import { Text } from '@/components/ui/text'

export function Footer() {
  return (
    <footer class="mt-8 flex items-center justify-between text-(--sub)">
      <div class="flex items-center gap-4">
        <a href="#" class="hover:text-(--text)"><Text variant="caption">contact</Text></a>
        <a href="#" class="hover:text-(--text)"><Text variant="caption">support</Text></a>
        <a href="#" class="hover:text-(--text)"><Text variant="caption">github</Text></a>
        <a href="#" class="hover:text-(--text)"><Text variant="caption">discord</Text></a>
      </div>
      <Text variant="caption">v1.0.0</Text>
    </footer>
  )
}
