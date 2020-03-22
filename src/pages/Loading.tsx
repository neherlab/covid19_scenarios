import React from 'react'

import './Loading.scss'

import { useTranslation } from 'react-i18next'

function Loading() {
  const { t } = useTranslation()
  return <h1 className="h1-loading">{t('Loading')}</h1>
}

export default Loading
