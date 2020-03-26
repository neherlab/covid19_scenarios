import React, { useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import './LandingPage.scss'
import promoImage from './tool.jpg'
import { setShouldSkipLandingPage } from '../../state/ui/ui.actions'
import { SKIP_LANDING_PAGE_KEY } from '../../state/ui/ui.reducer'
import { State } from '../../state/reducer'

function LandingPage() {
  const [isSkipLandingChecked, setSkipLandingChecked] = useState(false)
  const skipLandingPage = useSelector(({ ui }: State) => ui.skipLandingPage)
  const dispatch = useDispatch()
  return (
    <>
      <div className="landing-page">
        <div className="landing-page__hero-section">
          <div className="landing-page__header">
            <h1 className="landing-page__heading">COVID-19 Scenarios</h1>
            <p>Tool that models COVID-19 outbreak and hospital demand</p>
          </div>
          <Link
            onClick={() => {
              dispatch(setShouldSkipLandingPage({ shouldSkip: true }))
              if (isSkipLandingChecked) {
                localStorage.setItem(SKIP_LANDING_PAGE_KEY, '1')
              }
            }}
            to="/"
            className="landing-page__simulate-link"
          >
            Simulate
          </Link>
        </div>
        <div className="landing-page__content-section">
          <img className="landing-page__promo-image" src={promoImage} alt="Simulator showing results" />
          <div className="landing-page__content-section-text">
            <h1>Section</h1>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Delectus reiciendis culpa fuga mollitia officiis
              velit tempore eum nobis, eligendi debitis distinctio neque non labore placeat laudantium minima ut quos?
              Molestiae!
            </p>
          </div>
          {!skipLandingPage && (
            <div>
              <input
                onChange={(e) => {
                  console.log(e.target.checked)
                  setSkipLandingChecked(e.target.checked)
                }}
                id="skip-landing-page"
                type="checkbox"
              />
              <label className="skip-landing-page-label" htmlFor="skip-landing-page">
                Skip straight to simulator next time
              </label>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default LandingPage
