import React from 'react'

import { RouteComponentProps, withRouter } from 'react-router-dom'

import { FaGithub, FaTwitter } from 'react-icons/fa'

// import LanguageSwitcher from './LanguageSwitcher'
import LinkExternal from '../Router/LinkExternal'
import NavigationLink from './NavigationLink'

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
    <nav
      className="navbar navbar-expand navbar-dark bg-dark navbar-scroll hide-native-scrollbar"
      role="navigation"
      data-testid="NavigationBar"
    >
      <a className="navbar-brand" href="/">
        <img className="navbar-brand-image" alt="logo" src={logo} />
      </a>

      <ul className="navbar-nav">
        {Object.entries(navLinks).map(([url, text]) => {
          return <NavigationLink key={url} url={url} content={text} active={location.pathname === url} />
        })}
      </ul>

      <div className="navbar-nav ml-auto">
        <div className="mx-2">
          <LinkExternal url="https://neherlab.org/" alt="Link to webpage of NeherLab at University of Basel">
            <img height={'28px'} alt="NeherLab logo" src={logo} />
          </LinkExternal>
        </div>

        <div className="mx-2">
          <LinkExternal url="https://twitter.com/richardneher" alt="Link to Twitter page of Richard Neher">
            <FaTwitter size={28} color="#aaa" />
          </LinkExternal>
        </div>

        <div className="mx-2">
          <LinkExternal
            url="https://github.com/neherlab/covid19_scenarios"
            alt="Link to Github page of the COVID-19 Scenarios project"
          >
            <FaGithub size={28} color="#aaa" />
          </LinkExternal>
        </div>

        {/* <LanguageSwitcher /> */}
      </div>
    </nav>
  )
}

export default withRouter(NavigationBar)
