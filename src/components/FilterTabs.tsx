import React from 'react'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface FilterTabsProps<T extends string> {
  value: T
  options: ReadonlyArray<{ value: T; label: string }>
  onChange: (value: T) => void
}

const FilterTabs = <T extends string>({
  value,
  options,
  onChange,
}: FilterTabsProps<T>): React.ReactElement => {
  return (
    <Tabs
      className="items-center"
      value={value}
      onValueChange={(newValue) => onChange(newValue as T)}
    >
      <TabsList>
        {options.map((option) => (
          <TabsTrigger key={option.value} value={option.value} className="px-4">
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

export default FilterTabs
