import React, { HTMLProps, PropsWithChildren } from 'react'

import classNames from 'classnames'

import { Link } from 'src/components/Link/Link'

export interface NavigationLinkProps extends PropsWithChildren<HTMLProps<HTMLDataListElement>> {
  active?: boolean
  url: string
}

export default function NavigationLink({ active, url, children }: NavigationLinkProps) {
  return (
    <li className={classNames('nav-item', active && 'active')}>
      <Link className="nav-link" href={url}>
        {children}
      </Link>
    </li>
  )
}
