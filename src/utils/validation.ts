import { FieldError, RegisterOptions } from 'react-hook-form'

export function getValidationHint(
  typeMap: {
    [key in keyof RegisterOptions]?: string
  } & {
    [key: string]: string | undefined
  },
  fieldError?: FieldError,
): string | undefined {
  if (!fieldError) return undefined

  for (const key in typeMap) {
    if (fieldError.type === key) {
      return typeMap[key]
    }
  }

  return fieldError.message
}
