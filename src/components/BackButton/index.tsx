import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

const BackButton = ({ title }: { title?: string }) => {
  const navigate = useNavigate()

  return (
    <div className="space-x-4">
      <Button
        variant="outline"
        onClick={() => navigate(-1)}
        title="back"
        size="icon"
        className="border-2"
      >
        <ArrowLeftIcon />
      </Button>
      {title ? <span className="">{title}</span> : null}
    </div>
  )
}

export default BackButton
