import { Show, createMemo, createSignal } from 'solid-js'

import AuthForms from '@/features/auth/components/auth-forms'
import ResultsTable from '@/features/results/components/results-table'
import { getErrorMessage } from '@/lib/api-client'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'

type ProfileProps = {
  onNavigate: (target: string) => void
}

function ProfilePage(props: ProfileProps) {
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
                  <Text variant="label" upper>profile</Text>
                  <div class="mt-2">
                    <Text variant="metric">{session().data?.user.name}</Text>
                  </div>
                  <div class="mt-2">
                    <Text variant="body">{session().data?.user.email}</Text>
                  </div>
                </div>

                <div class="flex flex-wrap items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    class="px-3 py-1.5"
                    onClick={() => props.onNavigate('/')}
                  >
                    back home
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    class="px-3 py-1.5"
                    onClick={handleSignOut}
                    disabled={isSigningOut()}
                  >
                    {isSigningOut() ? 'signing out...' : 'sign out'}
                  </Button>
                </div>
              </div>
            </section>

            <section class="rounded-xl bg-(--sub-alt)/22 p-5">
              <div class="space-y-4">
                <Text variant="label" upper>recent results</Text>
                <ResultsTable />
              </div>
            </section>

            <Show when={statusMessage()}>
              {(message) => (
                <div class="text-(--main)">
                  <Text variant="body">{message()}</Text>
                </div>
              )}
            </Show>

            <Show when={errorMessage()}>
              {(message) => (
                <div class="text-(--error)">
                  <Text variant="body">{message()}</Text>
                </div>
              )}
            </Show>
          </div>
        </Show>
      </Show>
    </div>
  )
}

export default ProfilePage
