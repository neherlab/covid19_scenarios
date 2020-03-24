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
          <button className="landing-page__simulate-button">Simulate</button>
        </div>
        <div className="landing-page__content-section">
          <img className="landing-page__promo-image" src={promoImage} alt="Simulator showing results" />
          Content
        </div>
      </div>
    </>
  )
}

export default LandingPage
