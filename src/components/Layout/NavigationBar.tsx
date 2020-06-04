import React from 'react'

import { RouteComponentProps, withRouter, Link } from 'react-router-dom'

import { FaGithub, FaTwitter } from 'react-icons/fa'

// import LanguageSwitcher from './LanguageSwitcher'
import LinkExternal from '../Router/LinkExternal'
import { LanguageSwitcher } from './LanguageSwitcher'
import NavigationLink from './NavigationLink'

import BrandLogo from '../../assets/img/neherlab.svg'

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
      <Link className="navbar-brand" to="/" role="button">
        <BrandLogo viewBox="0 0 354.325 354.325" className="navigation-bar-product-logo" />
      </Link>

      <ul className="navbar-nav">
        {Object.entries(navLinks).map(([url, text]) => {
          return <NavigationLink key={url} url={url} content={text} active={location.pathname === url} />
        })}
      </ul>

      <ul className="navbar-nav ml-auto d-flex">
        <li className="nav-item mx-2 my-auto">
          <LanguageSwitcher />
        </li>

        <li className="nav-item mx-2 my-auto">
          <LinkExternal url="https://neherlab.org/" alt="Link to webpage of NeherLab at University of Basel">
            <BrandLogo viewBox="0 0 354.325 354.325" className="navigation-bar-company-logo" />
          </LinkExternal>
        </li>

        <li className="nav-item mx-2 my-auto">
          <LinkExternal url="https://twitter.com/richardneher" alt="Link to Twitter page of Richard Neher">
            <FaTwitter size={28} color="#aaa" />
          </LinkExternal>
        </li>

        <li className="nav-item mx-2 my-auto">
          <LinkExternal
            url="https://github.com/neherlab/covid19_scenarios"
            alt="Link to Github page of the COVID-19 Scenarios project"
          >
            <FaGithub size={28} color="#aaa" />
          </LinkExternal>
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(NavigationBar)
