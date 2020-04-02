import React, { useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import LocalStorage, { LOCAL_STORAGE_KEYS } from '../../helpers/localStorage'
import { setShouldSkipLandingPage } from '../../state/ui/ui.actions'
import { State } from '../../state/reducer'
import promoImage from './tool.jpg'
import './LandingPage.scss'

import { useTranslation } from 'react-i18next'

function LandingPage() {
  const { t } = useTranslation()
  const [isSkipLandingChecked, setSkipLandingChecked] = useState(false)
  const showSkipCheckbox = useSelector(({ ui }: State) => !ui.skipLandingPage)
  const dispatch = useDispatch()
  const onLinkClick = useCallback(() => {
    dispatch(setShouldSkipLandingPage({ shouldSkip: true }))

    if (isSkipLandingChecked) {
      LocalStorage.set(LOCAL_STORAGE_KEYS.SKIP_LANDING_PAGE, String(true))
    }
  }, [dispatch, isSkipLandingChecked])

  const onCheckboxChange = useCallback((e) => {
    setSkipLandingChecked(e.target.checked)
  }, [])

  return (
    <div className="landing-page">
      <div className="landing-page__hero-section">
        <div className="landing-page__header">
          <h1 className="landing-page__heading">{t('COVID-19 Scenarios')}</h1>
          <p className="landing-page__sub-heading">{t('Tool that models COVID-19 outbreak and hospital demand')}</p>
        </div>
        <Link onClick={onLinkClick} to="/" className="landing-page__simulate-link">
          {t('Simulate')}
        </Link>
      </div>
      <div className="landing-page__content-section">
        <img className="landing-page__promo-image" src={promoImage} alt="Simulator showing results" />
        <div className="landing-page__content-section-text">
          <h1>{t('Simulate Outbreaks')}</h1>
          <p>
            {t(`This tool simulates a COVID19 outbreak. The primary purpose of the tool is to explore the dynamics of
            COVID19 cases and the associated strain on the health care system in the near future. The outbreak is
            influenced by infection control measures such as school closures, lock-down etc. Analogously, you can
            explore the effect of isolation on specific age groups.`)}
          </p>
        </div>
        {showSkipCheckbox && (
          <div>
            <input onChange={onCheckboxChange} id="skip-landing-page" type="checkbox" />
            <label className="skip-landing-page-label" htmlFor="skip-landing-page">
              {t('Skip straight to simulator next time')}
            </label>
          </div>
        )}
      </div>
    </div>
  )
}

export default LandingPage
