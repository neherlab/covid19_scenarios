import React, { useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import LocalStorage, { LOCAL_STORAGE_KEYS } from '../../helpers/localStorage'
import { setUserData, getCurrentUser } from '../../helpers/cloudStorage'

import { setShouldSkipLandingPage, setLoginVisible } from '../../state/ui/ui.actions'
import { State } from '../../state/reducer'
import promoImage from './tool.jpg'
import './LandingPage.scss'

import { useTranslation } from 'react-i18next'

interface LandingPageProps {
  initialQueryString: string
}

function LandingPage({ initialQueryString }: LandingPageProps) {
  const { t } = useTranslation()
  const [isSkipLandingChecked, setSkipLandingChecked] = useState(false)
  const showSkipCheckbox = useSelector(({ ui }: State) => !ui.skipLandingPage)
  const userIsLogged: boolean = useSelector(({ user }): State => user.currentUserUid !== null ? true : false)
  const dispatch = useDispatch()
  const redirectUrl = `/${initialQueryString || ''}`

  console.log(userIsLogged)

  const onSimulateLinkClick = useCallback(() => {
    dispatch(setShouldSkipLandingPage({ shouldSkip: true }))

    if (isSkipLandingChecked) {
      LocalStorage.set(LOCAL_STORAGE_KEYS.SKIP_LANDING_PAGE, String(true))
      
      let data = {}
      data[LOCAL_STORAGE_KEYS.SKIP_LANDING_PAGE] = true
      setUserData(getCurrentUser(), data)
    }
  }, [dispatch, isSkipLandingChecked])

  const onLoginClick = () => {
    dispatch(setLoginVisible({ loginVisible: true }))
  }

  const onCheckboxChange = useCallback((e) => {
    setSkipLandingChecked(e.target.checked)
  }, [])

  return (
    <div className="landing-page">
      <div className="landing-page__hero-section">
        <div className="landing-page__header">
          <h1 className="landing-page__heading">{t('COVID-19 Scenarios')}</h1>
          <p className="landing-page__sub-heading">{t('Tool that models COVID-19 outbreak and hospital demand')}</p>
          <Link onClick={onSimulateLinkClick} to={redirectUrl} className="landing-page__link">
            {t('Simulate')}
          </Link>
          {userIsLogged === false && <Link onClick={onLoginClick} className="landing-page__link">
            {t('Login')}
          </Link>}
        </div>
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
