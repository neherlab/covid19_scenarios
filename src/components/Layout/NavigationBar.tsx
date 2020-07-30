import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { connect } from 'react-redux'
import { FaGithub, FaTwitter } from 'react-icons/fa'
import { Container } from 'reactstrap'

import { COMPANY_NAME, PROJECT_NAME } from 'src/constants'

import { State } from 'src/state/reducer'
import { selectPathname } from 'src/state/router/router.selectors'

import { Link } from 'src/components/Link/Link'
import { LinkExternal } from 'src/components/Link/LinkExternal'

import { ReactComponent as BrandLogo } from 'src/assets/img/neherlab.svg'

import { LanguageSwitcher } from './LanguageSwitcher'
import NavigationLink from './NavigationLink'

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
      '/': PROJECT_NAME,
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
        title: COMPANY_NAME,
        url: 'https://neherlab.org/',
        alt: t('Link to our webpage'),
        icon: <BrandLogo viewBox="0 0 354.325 354.325" className="navigation-bar-company-logo" />,
      },
      {
        title: t('Twitter'),
        url: 'https://twitter.com/richardneher',
        alt: t('Link to our Twitter'),
        icon: <FaTwitter size={28} color="#aaa" />,
      },
      {
        title: t('GitHub'),
        url: 'https://github.com/neherlab/webclades',
        alt: t('Link to our Github page'),
        icon: <FaGithub size={28} color="#aaa" />,
      },
    ],
    [t],
  )

  return (
    <Container fluid className="pb-1">
      <nav
        className="navbar navbar-expand navbar-dark bg-dark navbar-scroll hide-native-scrollbar"
        role="navigation"
        data-testid="NavigationBar"
      >
        <Link className="navbar-brand" href="/" role="button">
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
    </Container>
  )
}
