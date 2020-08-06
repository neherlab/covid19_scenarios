import React, { PropsWithChildren } from 'react'

export interface LinkExternalProps extends React.HTMLProps<HTMLAnchorElement> {
  url?: string
  href?: string
}

export function LinkExternal({ url, href, children, ...restProps }: PropsWithChildren<LinkExternalProps>) {
  return (
    <a target="_blank" rel="noopener noreferrer" href={url ?? href} {...restProps}>
      {children}
    </a>
  )
}
