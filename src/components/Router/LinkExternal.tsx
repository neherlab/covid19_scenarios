import React, { PropsWithChildren } from 'react'

export interface LinkExternalProps {
  url: string
}

export default function LinkExternal({ url, children }: PropsWithChildren<LinkExternalProps>) {
  return (
    <a target="_blank" rel="noopener noreferrer" href={url}>
      {children}
    </a>
  )
}
