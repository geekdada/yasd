import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import satisfies from 'semver/functions/satisfies'
import store from 'store2'

import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { LastUsedVersion } from '@/utils/constant'

const currentVersion = process.env.REACT_APP_VERSION as string

const NewVersionAlert: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [versionUrl, setVersionUrl] = useState<string>()
  const { t } = useTranslation()

  useEffect(() => {
    const lastUsedVersion = store.get(LastUsedVersion)

    if (lastUsedVersion && !satisfies(currentVersion, `~${lastUsedVersion}`)) {
      setVersionUrl(
        `https://github.com/geekdada/yasd/releases/tag/v${currentVersion}`,
      )
      setIsOpen(true)
    }

    store.set(LastUsedVersion, currentVersion)
  }, [])

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('new_version_alert.title')}</DialogTitle>
        </DialogHeader>
        <div className="mb-3">{t('new_version_alert.message')}</div>
        <DialogFooter>
          <ButtonGroup>
            <a href={versionUrl} target="_blank" rel="noreferrer">
              <Button onClick={() => setIsOpen(false)}>
                {t('common.see')}
              </Button>
            </a>
          </ButtonGroup>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default NewVersionAlert
