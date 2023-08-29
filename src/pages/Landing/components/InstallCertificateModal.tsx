import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'twin.macro'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { TypographyP } from '@/components/ui/typography'

const Li = tw.li`mt-2 space-y-2`

const InstallCertificateModal: React.FC<{
  origin?: string
  accessKey?: string
  open: boolean
  onOpenChange: (newState: boolean) => void
}> = ({ origin, accessKey, open, onOpenChange }) => {
  const { t } = useTranslation()
  const downloadUrl = useMemo(() => {
    if (!accessKey || !origin) return undefined

    const u = new URL('/v1/mitm/ca', origin)

    u.searchParams.set('x-key', accessKey)

    return u
  }, [origin, accessKey])

  if (!downloadUrl) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="text-lg font-semibold">
          {t('tls_instruction.title')}
        </DialogHeader>
        <div>
          <TypographyP>{t('tls_instruction.description')}</TypographyP>

          <ol className="mt-5">
            <Li>
              <TypographyP>{t('tls_instruction.instruction1')}</TypographyP>
              <div>
                <a
                  href={downloadUrl.toString()}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button size="sm">{t('common.download')}</Button>
                </a>
              </div>
            </Li>
            <Li>
              <TypographyP>{t('tls_instruction.instruction2')}</TypographyP>
            </Li>
            <Li>
              <TypographyP>{t('tls_instruction.instruction3')}</TypographyP>
            </Li>
            <Li>
              <TypographyP>{t('tls_instruction.instruction4')}</TypographyP>
            </Li>
            <Li>
              <TypographyP>{t('tls_instruction.instruction5')}</TypographyP>
            </Li>
          </ol>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default InstallCertificateModal
