import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'

const BackButton = ({ title }: { title?: string }) => {
  const navigate = useNavigate()

  return (
    <div className="space-x-4">
      <Button
        variant="outline"
        onClick={() => navigate(-1)}
        title="navigate back"
        size="icon"
      >
        <ChevronLeft />
      </Button>
      {title ? <span className="">{title}</span> : null}
    </div>
  )
}

export default BackButton
