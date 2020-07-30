import React, { HTMLAttributes, PropsWithChildren } from 'react'

import NextLink, { LinkProps as NextLinkProps } from 'next/link'

export interface LinkProps extends PropsWithChildren<NextLinkProps & HTMLAttributes<HTMLAnchorElement>> {
  className?: string
}

export function Link({ className, children, href, ...restProps }: LinkProps) {
  return (
    <NextLink href={href} passHref={false}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a className={className}>{children}</a>
    </NextLink>
  )
}

export default Link
