import type { ParentProps } from 'solid-js'
import { onMount } from 'solid-js'

import ToastRegion from '@/components/toast-region'
import Commandline from '@/features/commandline/components/commandline'
import { themeManager } from '@/features/content/themes/manager'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

function Layout(props: ParentProps) {
  onMount(() => {
    themeManager.init()
  })

  return (
    <div class="relative min-h-screen bg-(--bg) font-mono text-(--text)">
      <Commandline />
      <ToastRegion />
      <div class="mx-auto flex min-h-screen w-full max-w-[1320px] flex-col px-5 py-8 sm:px-8 lg:px-10 xl:px-12">
        <Navbar />

        <main class="flex-1 flex flex-col justify-center py-8">
          {props.children}
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default Layout
