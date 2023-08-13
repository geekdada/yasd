import React from 'react'

const PageContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div id="page-container" className="relative pb-5">
      {children}
    </div>
  )
}

export default PageContainer
