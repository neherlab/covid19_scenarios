import React, { useMemo } from 'react'

import Head from 'next/head'

import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'

import { DOMAIN, PROJECT_DESCRIPTION, PROJECT_NAME, URL_SOCIAL_IMAGE, TWITTER_USERNAME } from 'src/constants'

import { getLocaleWithKey, LocaleKey } from 'src/i18n/i18n'
import { State } from 'src/state/reducer'

export interface SEOProps {
  localeKey: LocaleKey
}

const mapStateToProps = (state: State) => ({
  localeKey: state.settings.localeKey,
})

const mapDispatchToProps = {}

export const SEO = connect(mapStateToProps, mapDispatchToProps)(SEODisconnected)

export function SEODisconnected({ localeKey }: SEOProps) {
  const localeFull = getLocaleWithKey(localeKey).full
  const htmlAttributes = useMemo(() => ({ lang: localeKey }), [localeKey])
  return (
    <>
      <Helmet htmlAttributes={htmlAttributes} />
      <Head>
        <title>{PROJECT_NAME}</title>

        <meta name="description" content={PROJECT_DESCRIPTION} />
        <meta name="application-name" content={PROJECT_NAME} />

        <meta itemProp="description" content={PROJECT_DESCRIPTION} />
        <meta itemProp="image" content={URL_SOCIAL_IMAGE} />
        <meta itemProp="name" content={PROJECT_NAME} />
        <meta property="og:description" content={PROJECT_DESCRIPTION} />
        <meta property="og:image" content={URL_SOCIAL_IMAGE} />
        <meta property="og:image:secure_url" content={URL_SOCIAL_IMAGE} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="600" />
        <meta property="og:locale" content={localeFull} />
        <meta property="og:title" content={PROJECT_NAME} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={DOMAIN} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:description" content={PROJECT_DESCRIPTION} />
        <meta name="twitter:image" content={URL_SOCIAL_IMAGE} />
        <meta name="twitter:image:alt" content={PROJECT_DESCRIPTION} />
        <meta name="twitter:title" content={PROJECT_NAME} />
        <meta name="twitter:url" content={DOMAIN} />
        <meta name="twitter:site" content={TWITTER_USERNAME} />
      </Head>
    </>
  )
}
