import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

import { FormConfirmProperties } from '../types'
import { useConfirmations } from '../UIProvider'

type ConfirmationFormProps = {
  confirmation: FormConfirmProperties
  index: number
}

export const ConfirmationForm = ({
  confirmation,
  index,
}: ConfirmationFormProps) => {
  const { t } = useTranslation()

  const {
    form: rawFormSchema,
    formLabels,
    formDefaultValues,
    formDescriptions,
  } = confirmation
  const formSchema = z.object(rawFormSchema)
  const fields = Object.keys(rawFormSchema)
  const form = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formDefaultValues ?? {},
  })

  const { cleanConfirmation } = useConfirmations()

  const handleAction = useCallback(
    (values: z.infer<typeof formSchema>) => {
      if (confirmation.onConfirm) {
        confirmation.onConfirm(values)
      }

      cleanConfirmation(index)
    },
    [cleanConfirmation, confirmation, index],
  )

  const handleCancel = useCallback(() => {
    if (confirmation.onCancel) {
      confirmation.onCancel()
    }

    cleanConfirmation(index)
  }, [cleanConfirmation, confirmation, index])

  const optionalFlag = (fieldName: string) => {
    return formSchema.shape[fieldName].isOptional() ? null : '*'
  }

  const fieldLabel = (fieldName: string) => {
    return formLabels?.[fieldName] ?? fieldName
  }

  const fieldType = (fieldName: string) => {
    const z = formSchema.shape[fieldName]

    try {
      z.parse('test')
      return 'string'
    } catch {
      // Not a string
    }

    try {
      z.parse(true)
      return 'boolean'
    } catch {
      // Not a boolean
    }

    return 'unknown'
  }

  const fieldDescription = (fieldName: string) => {
    return formDescriptions?.[fieldName]
  }

  return (
    <AlertDialog open={confirmation.open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{confirmation.title}</AlertDialogTitle>

          {confirmation.description ? (
            <AlertDialogDescription>
              {confirmation.description}
            </AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleAction)}
            className="space-y-8"
          >
            {fields.map((fieldName, index) => (
              <FormField
                key={fieldName}
                control={form.control}
                name={fieldName}
                render={({ field }) => (
                  <FormItem className="grid">
                    <div className="grid grid-cols-3 md:grid-cols-4 items-center gap-4">
                      <FormLabel>
                        {fieldLabel(fieldName)} {optionalFlag(fieldName)}
                      </FormLabel>

                      {fieldType(fieldName) === 'string' && (
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value as string}
                            type="text"
                            autoComplete="off"
                            autoFocus={index === 0}
                            className="col-span-2 md:col-span-3"
                          />
                        </FormControl>
                      )}

                      {fieldType(fieldName) === 'boolean' && (
                        <div className="col-span-2 md:col-span-3 flex justify-end">
                          <FormControl>
                            <Switch
                              {...field}
                              checked={field.value as boolean}
                              onCheckedChange={(checked) =>
                                field.onChange(checked)
                              }
                            />
                          </FormControl>
                        </div>
                      )}
                    </div>

                    {fieldDescription(fieldName) ? (
                      <FormDescription>
                        {fieldDescription(fieldName)}
                      </FormDescription>
                    ) : null}

                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => handleCancel()}>
                {confirmation.cancelText ?? t('common.cancel')}
              </AlertDialogCancel>
              <AlertDialogAction type="submit">
                {confirmation.confirmText ?? t('common.confirm')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
