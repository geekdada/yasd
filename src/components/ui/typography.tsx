import React from 'react'

import { cn } from '@/utils/shadcn'

export function TypographyH1({
  children,
  className,
  ...props
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        'scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-5xl',
        className,
      )}
      {...props}
    >
      {children}
    </h1>
  )
}

export function TypographyH2({
  children,
  className,
  ...props
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        'scroll-m-20 border-b pb-2 text-2xl font-bold tracking-tight transition-colors first:mt-0',
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  )
}

export function TypographyH3({
  children,
  className,
  ...props
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('scroll-m-20 text-xl font-bold tracking-tight', className)}
      {...props}
    >
      {children}
    </h3>
  )
}

export function TypographyH4({
  children,
  className,
  ...props
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h4
      className={cn('scroll-m-20 text-lg font-bold tracking-tight', className)}
      {...props}
    >
      {children}
    </h4>
  )
}

export function TypographyP({
  children,
  className,
  ...props
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}
      {...props}
    >
      {children}
    </p>
  )
}

export function TypographyBlockquote({
  children,
  className,
  ...props
}: {
  children: React.ReactNode
} & React.HTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote
      className={cn('mt-6 border-l-2 pl-6 italic', className)}
      {...props}
    >
      {children}
    </blockquote>
  )
}

export function TypographySmall({
  children,
  className,
  ...props
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <small
      className={cn('text-sm font-medium leading-none', className)}
      {...props}
    >
      {children}
    </small>
  )
}

export function TypographyMuted({
  children,
  className,
  ...props
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)} {...props}>
      {children}
    </p>
  )
}
