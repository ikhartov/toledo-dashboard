import type { ServerError } from '~~/shared/types'

export const throwError = (error: unknown, name: string, code = 400) => {
  const input: ServerError = {}

  input.statusCode = code
  input.statusMessage = error instanceof Error ? error.message : String(error)

  console.error(name, error)
  throw createError(input)
}
