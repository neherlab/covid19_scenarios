import React, { HTMLProps, PropsWithChildren } from 'react'

import classNames from 'classnames'
import { Link } from 'react-router-dom'

export interface NavigationLinkProps extends PropsWithChildren<HTMLProps<HTMLDataListElement>> {
  active?: boolean
  url: string
}

export default function NavigationLink<T>({ active, url, children }: NavigationLinkProps) {
  return (
    <li className={classNames('nav-item', active && 'active')}>
      <Link className="nav-link" to={url}>
        {children}
      </Link>
    </li>
  )
}
