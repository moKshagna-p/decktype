import { Show, createMemo, createSignal } from 'solid-js'

import AuthForms from '@/features/auth/components/auth-forms'
import ResultHistory from '@/features/results/components/result-history'
import { getErrorMessage } from '@/lib/api-client'
import { authClient } from '@/lib/auth-client'

type ProfilePageProps = {
  onNavigate: (target: string) => void
}

function ProfilePage(props: ProfilePageProps) {
  const session = authClient.useSession()
  const [isSigningOut, setIsSigningOut] = createSignal(false)
  const [statusMessage, setStatusMessage] = createSignal<string | null>(null)
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null)

  const isAuthenticated = createMemo(() => Boolean(session().data?.user))
  const isSessionLoading = createMemo(() => session().isPending)

  const resetMessages = () => {
    setStatusMessage(null)
    setErrorMessage(null)
  }

  const handleSignOut = async () => {
    resetMessages()
    setIsSigningOut(true)

    try {
      const result = await authClient.signOut()

      if (result.error) {
        setErrorMessage(result.error.message ?? 'Unable to sign out.')
        return
      }

      setStatusMessage('Signed out.')
    }
    catch (error) {
      setErrorMessage(getErrorMessage(error, 'Unable to sign out.'))
    }
    finally {
      setIsSigningOut(false)
    }
  }

  return (
    <div class="flex w-full min-h-[72vh] flex-1">
      <Show
        when={!isSessionLoading()}
        fallback={(
          <div class="flex w-full items-center justify-center py-20">
            <div
              class="h-8 w-8 animate-spin rounded-full border-2 border-(--sub)/35 border-t-(--main)"
              aria-label="Loading profile"
              role="status"
            />
          </div>
        )}
      >
        <Show
          when={isAuthenticated()}
        fallback={(
          <AuthForms onSuccess={() => props.onNavigate('/')} />
        )}
        >
          <div class="w-full space-y-6">
            <section class="rounded-xl bg-(--sub-alt)/32 p-5">
              <div class="flex flex-wrap items-start justify-between gap-5">
              <div>
                <div class="t-label font-semibold uppercase tracking-[0.16em] text-(--sub)">
                  profile
                </div>
                <div class="t-metric mt-2 text-(--text)">
                  {session().data?.user.name}
                </div>
                <div class="t-body mt-2 text-(--sub)">{session().data?.user.email}</div>
              </div>

              <div class="t-body flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  class="rounded-md border border-(--sub)/35 px-3 py-1.5 text-(--sub) transition hover:text-(--text)"
                  onClick={() => props.onNavigate('/')}
                >
                  back home
                </button>
                <button
                  type="button"
                  class="rounded-md border border-(--sub)/35 px-3 py-1.5 text-(--sub) transition hover:text-(--text) disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={handleSignOut}
                  disabled={isSigningOut()}
                >
                  {isSigningOut() ? 'signing out...' : 'sign out'}
                </button>
              </div>
              </div>
            </section>

            <section class="rounded-xl bg-(--sub-alt)/22 p-5">
              <ResultHistory />
            </section>

            <Show when={statusMessage()}>
              {(message) => (
                <div class="t-body text-(--main)">{message()}</div>
              )}
            </Show>

            <Show when={errorMessage()}>
              {(message) => (
                <div class="t-body text-(--error)">{message()}</div>
              )}
            </Show>
          </div>
        </Show>
      </Show>
    </div>
  )
}

export default ProfilePage
