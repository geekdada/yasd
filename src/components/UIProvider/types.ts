import type { z, ZodObject, ZodRawShape, ZodTypeAny } from 'zod'

export type SimpleConfirmProperties = {
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  open?: boolean
}

export type FormConfirmProperties<
  Fields extends ZodRawShape = {
    [key: string]: ZodTypeAny
  },
  Keys extends (keyof Fields)[] = (keyof Fields)[],
> = {
  title: string
  form: Fields
  formLabels?: Partial<Record<Keys[number], string>>
  formDescriptions?: Partial<Record<Keys[number], string>>
  formDefaultValues?: Partial<Record<Keys[number], any>>
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm?: (result: z.infer<ZodObject<Fields>>) => void
  onCancel?: () => void
  open?: boolean
}

export type ConfirmProperties = SimpleConfirmProperties | FormConfirmProperties
