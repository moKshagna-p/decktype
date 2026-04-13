import { createSignal } from 'solid-js'

const backendUrl = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:3000'
const healthUrl = `${backendUrl.replace(/\/$/, '')}/api/health`
const POLL_INTERVAL_MS = 20000

const [isBackendDown, setIsBackendDown] = createSignal(false)

export async function checkBackendHealth() {
  try {
    const response = await fetch(healthUrl, {
      method: 'GET',
      credentials: 'include',
    })

    setIsBackendDown(!response.ok)
  }
  catch {
    setIsBackendDown(true)
  }
}

export function startBackendHealthPolling() {
  void checkBackendHealth()

  const interval = window.setInterval(() => {
    void checkBackendHealth()
  }, POLL_INTERVAL_MS)

  return () => {
    window.clearInterval(interval)
  }
}

export { isBackendDown }
