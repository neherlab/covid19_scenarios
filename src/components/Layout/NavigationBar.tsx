import React from 'react'

import { RouteComponentProps, withRouter } from 'react-router-dom'

import NavigationLink from './NavigationLink'
import LanguageSwitcher from '../LanguageSwitcher'

import logo from '../../assets/img/HIVEVO_logo.png'
import './NavigationBar.scss'

export interface NavLinkMap {
  [s: string]: string
}

export interface NavigationBarProps extends RouteComponentProps<{}> {
  navLinks: NavLinkMap
}

function NavigationBar({ navLinks, location }: NavigationBarProps) {
  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark" role="navigation" data-testid="NavigationBar">
      <a className="navbar-brand" href="/">
        <img className="navbar-brand-image" alt="logo" src={logo} />
        <h5 className="lab-name">NeherLab</h5>
      </a>

      <ul className="navbar-nav">
        {Object.entries(navLinks).map(([url, text]) => {
          return <NavigationLink key={url} url={url} content={text} active={location.pathname === url} />
        })}
      </ul>
      <div>
        <LanguageSwitcher />
      </div>
    </nav>
  )
}

export default withRouter(NavigationBar)
