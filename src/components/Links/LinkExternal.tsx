import React from 'react'

export interface LinkExternalProps<T> {
  content: T
  url: string
}

export default function LinkExternal<T>({ content, url }: LinkExternalProps<T>) {
  return (
    <a target="_blank" rel="noopener noreferrer" href={url}>
      {content}
    </a>
  )
}
