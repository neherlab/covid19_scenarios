import React from 'react'

import { Link } from 'react-router-dom'

export interface NavigationLinkProps<T> {
  active?: boolean
  content: T
  url: string
}

export default function NavigationLink<T>({ active, content, url }: NavigationLinkProps<T>) {
  const activeClass = active ? 'active' : ''

  return (
    <li className={`nav-item ${activeClass}`}>
      <Link className="nav-link" to={url}>
        {content}
      </Link>
    </li>
  )
}
