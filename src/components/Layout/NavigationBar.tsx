import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { FaGithub, FaTwitter } from 'react-icons/fa'

import LinkExternal from '../Router/LinkExternal'
import { State } from '../../state/reducer'
import { LanguageSwitcher } from './LanguageSwitcher'
import NavigationLink from './NavigationLink'

import { selectPathname } from '../../state/router/router.selectors'

import { ReactComponent as BrandLogo } from '../../assets/img/neherlab.svg'

import './NavigationBar.scss'

export interface NavigationBarProps {
  pathname: string
}

const mapStateToProps = (state: State) => ({
  pathname: selectPathname(state),
})

const mapDispatchToProps = {}

export const NavigationBar = connect(mapStateToProps, mapDispatchToProps)(NavigationBarDisconnected)

export function NavigationBarDisconnected({ pathname }: NavigationBarProps) {
  const { t } = useTranslation()

  const navLinks = useMemo(
    () => ({
      '/': t('COVID-19 Scenarios'),
      '/about': t('About'),
      '/faq': t('FAQ'),
      '/updates': t('Updates'),
      '/team': t('Team'),
    }),
    [t],
  )

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
          return (
            <NavigationLink key={url} url={url} active={pathname === url}>
              {text}
            </NavigationLink>
          )
        })}
      </ul>

      <ul className="navbar-nav ml-auto d-flex">
        <li className="nav-item mx-2 my-auto">
          <LanguageSwitcher />
        </li>

        <li className="nav-item mx-2 my-auto">
          <LinkExternal
            title={t('neherlab')}
            url="https://neherlab.org/"
            alt={t('Link to webpage of NeherLab at University of Basel')}
          >
            <BrandLogo viewBox="0 0 354.325 354.325" className="navigation-bar-company-logo" />
          </LinkExternal>
        </li>

        <li className="nav-item mx-2 my-auto">
          <LinkExternal
            title={t('Twitter')}
            url="https://twitter.com/richardneher"
            alt={t('Link to Twitter page of Richard Neher')}
          >
            <FaTwitter size={28} color="#aaa" />
          </LinkExternal>
        </li>

        <li className="nav-item mx-2 my-auto">
          <LinkExternal
            title={t('GitHub')}
            url="https://github.com/neherlab/covid19_scenarios"
            alt={t('Link to Github page of the COVID-19 Scenarios project')}
          >
            <FaGithub size={28} color="#aaa" />
          </LinkExternal>
        </li>
      </ul>
    </nav>
  )
}
