import { createForm } from '@tanstack/solid-form'
import { Show, createSignal } from 'solid-js'

import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import { Typography } from '@/components/ui/typography'
import { getErrorMessage } from '@/lib/api-client'
import { authClient } from '@/lib/auth-client'

import { registerSchema } from './schemas'
import { getFirstValidationMessage } from './utils'

type RegisterFormProps = {
  onSuccess?: () => void
  disabled?: boolean
}

export function RegisterForm(props: RegisterFormProps) {
  const [statusMessage, setStatusMessage] = createSignal<string | null>(null)
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null)

  const form = createForm(() => ({
    defaultValues: {
      name: '',
      email: '',
      confirmEmail: '',
      password: '',
      confirmPassword: '',
    },
    validators: {
      onSubmit: registerSchema,
    },
    onSubmit: async ({ value }) => {
      setStatusMessage(null)
      setErrorMessage(null)

      try {
        const result = await authClient.signUp.email({
          name: value.name.trim(),
          email: value.email.trim(),
          password: value.password,
        })

        if (result.error) {
          setErrorMessage(result.error.message ?? 'Unable to create account.')
          return
        }

        setStatusMessage('Account created.')
        props.onSuccess?.()
      }
      catch (error) {
        setErrorMessage(getErrorMessage(error, 'Unable to create account.'))
      }
    },
  }))

  const formState = form.useStore((state) => ({
    isSubmitting: state.isSubmitting,
    submissionAttempts: state.submissionAttempts,
  }))

  const clearMessages = () => {
    setStatusMessage(null)
    setErrorMessage(null)
  }

  return (
    <form
      class="mx-auto flex w-full max-w-sm flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
    >
      <Typography variant="body" weight="semibold" color="sub" class="mb-1">
        register
      </Typography>

      <form.Field name="name">
        {(field) => {
          const validationMessage = getFirstValidationMessage(field().state.meta.errors)

          return (
            <>
              <Input
                value={field().state.value}
                onInput={(event) => {
                  clearMessages()
                  field().handleChange(event.currentTarget.value)
                }}
                onBlur={field().handleBlur}
                placeholder="username"
                required
              />
              <Show when={validationMessage && formState().submissionAttempts > 0}>
                <Typography variant="body" color="error" class="pt-1">
                  {validationMessage}
                </Typography>
              </Show>
            </>
          )
        }}
      </form.Field>

      <form.Field name="email">
        {(field) => {
          const validationMessage = getFirstValidationMessage(field().state.meta.errors)

          return (
            <>
              <Input
                type="email"
                value={field().state.value}
                onInput={(event) => {
                  clearMessages()
                  field().handleChange(event.currentTarget.value)
                }}
                onBlur={field().handleBlur}
                placeholder="email"
                required
              />
              <Show when={validationMessage && formState().submissionAttempts > 0}>
                <Typography variant="body" color="error" class="pt-1">
                  {validationMessage}
                </Typography>
              </Show>
            </>
          )
        }}
      </form.Field>

      <form.Field name="confirmEmail">
        {(field) => {
          const validationMessage = getFirstValidationMessage(field().state.meta.errors)

          return (
            <>
              <Input
                type="email"
                value={field().state.value}
                onInput={(event) => {
                  clearMessages()
                  field().handleChange(event.currentTarget.value)
                }}
                onBlur={field().handleBlur}
                placeholder="verify email"
                required
              />
              <Show when={validationMessage && formState().submissionAttempts > 0}>
                <Typography variant="body" color="error" class="pt-1">
                  {validationMessage}
                </Typography>
              </Show>
            </>
          )
        }}
      </form.Field>

      <form.Field name="password">
        {(field) => {
          const validationMessage = getFirstValidationMessage(field().state.meta.errors)

          return (
            <>
              <Input
                type="password"
                value={field().state.value}
                onInput={(event) => {
                  clearMessages()
                  field().handleChange(event.currentTarget.value)
                }}
                onBlur={field().handleBlur}
                placeholder="password"
                required
              />
              <Show when={validationMessage && formState().submissionAttempts > 0}>
                <Typography variant="body" color="error" class="pt-1">
                  {validationMessage}
                </Typography>
              </Show>
            </>
          )
        }}
      </form.Field>

      <form.Field name="confirmPassword">
        {(field) => {
          const validationMessage = getFirstValidationMessage(field().state.meta.errors)

          return (
            <>
              <Input
                type="password"
                value={field().state.value}
                onInput={(event) => {
                  clearMessages()
                  field().handleChange(event.currentTarget.value)
                }}
                onBlur={field().handleBlur}
                placeholder="verify password"
                required
              />
              <Show when={validationMessage && formState().submissionAttempts > 0}>
                <Typography variant="body" color="error" class="pt-1">
                  {validationMessage}
                </Typography>
              </Show>
            </>
          )
        }}
      </form.Field>

      <Show when={statusMessage()}>
        {(message) => (
          <Typography variant="body" color="main" class="pt-1">
            {message()}
          </Typography>
        )}
      </Show>
      <Show when={errorMessage()}>
        {(message) => (
          <Typography variant="body" color="error" class="pt-1">
            {message()}
          </Typography>
        )}
      </Show>

      <Button
        type="submit"
        size="lg"
        class="mt-1"
        disabled={props.disabled || formState().isSubmitting}
      >
        {formState().isSubmitting ? 'creating account...' : 'sign up'}
      </Button>
    </form>
  )
}
