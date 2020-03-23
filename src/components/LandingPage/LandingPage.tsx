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
          <img className="landing-page__promo-image" src={promoImage} alt="Simulator showing results" />
          <svg className="landing-page__wave" viewBox="0 0 60 10">
            <pattern x="-6" id="waves" patternUnits="userSpaceOnUse" width="10" height="10">
              <path d="M0 10 V5 Q2.5 2.5 5 5 T10 5 V10" fill="currentColor" />
            </pattern>
            <rect x="0" y="0" width="60" height="10" fill="url(#waves)" />
          </svg>
        </div>
        <div className="landing-page__content-section">Content</div>
      </div>
    </>
  )
}

export default LandingPage
