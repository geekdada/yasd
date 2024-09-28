import React from 'react'
import { useRouteError } from 'react-router-dom'

export default function ErrorBoundary() {
  const error = useRouteError()

  console.error(error)

  return <div>Dang!</div>
}

ErrorBoundary.displayName = 'ErrorBoundary'

export { ErrorBoundary }
