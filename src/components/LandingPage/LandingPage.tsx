import React from 'react'

import './LandingPage.scss'
import promoImage from './tool.jpg'

function LandingPage() {
  return (
    <>
      <div className="landing-page">
        <div className="landing-page__hero-section">
          <div className="landing-page__header">
            <h1 className="landing-page__heading">COVID-19 Scenarios</h1>
            <p>Tool that models COVID-19 outbreak and hospital demand</p>
          </div>
          <button type="button" className="landing-page__simulate-button">
            Simulate
          </button>
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
          <div>
            <input id="skip-landing-page" type="checkbox" />
            <label htmlFor="skip-landing-page">Skip straight to simulator next time</label>
          </div>
        </div>
      </div>
    </>
  )
}

export default LandingPage
