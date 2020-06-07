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

  const navLinksLeft = useMemo(
    () => ({
      '/': t('COVID-19 Scenarios'),
      '/about': t('About'),
      '/faq': t('FAQ'),
      '/updates': t('Updates'),
      '/team': t('Team'),
    }),
    [t],
  )

  const navLinksRight = useMemo(
    () => [
      {
        title: t('neherlab'),
        url: 'https://neherlab.org/',
        alt: t('Link to webpage of NeherLab at University of Basel'),
        icon: <BrandLogo viewBox="0 0 354.325 354.325" className="navigation-bar-company-logo" />,
      },
      {
        title: t('Twitter'),
        url: 'https://twitter.com/richardneher',
        alt: t('Link to Twitter page of Richard Neher'),
        icon: <FaTwitter size={28} color="#aaa" />,
      },
      {
        title: t('GitHub'),
        url: 'https://github.com/neherlab/covid19_scenarios',
        alt: t('Link to Github page of the COVID-19 Scenarios project'),
        icon: <FaGithub size={28} color="#aaa" />,
      },
    ],
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
        {Object.entries(navLinksLeft).map(([url, text]) => {
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

        {navLinksRight.map(({ title, url, alt, icon }) => (
          <li key={title} className="nav-item mx-2 my-auto">
            <LinkExternal title={title} url={url} alt={alt}>
              {icon}
            </LinkExternal>
          </li>
        ))}
      </ul>
    </nav>
  )
}
