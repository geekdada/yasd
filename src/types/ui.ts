import React from 'react'

export type ClickEvent<T = Element> =
  | React.MouseEvent<T>
  | React.KeyboardEvent<T>

export type OnClose = (event?: ClickEvent) => void
