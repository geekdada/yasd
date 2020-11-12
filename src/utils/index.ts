export const isFalsy = (obj: string | boolean | 1 | 0) =>
  obj === 0 || obj === false || (typeof obj === 'string' && obj.length === 0)

export const isTruthy = (obj: string | boolean | 1 | 0) =>
  obj === 1 || obj === true || (typeof obj === 'string' && obj.length > 0)
