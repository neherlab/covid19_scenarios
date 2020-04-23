import React from 'react'

import Main from '../components/Main/Main'
import HandleInitialState from '../components/Main/HandleInitialState'
import Disclaimer from '../components/Main/Disclaimer'

import './Home.scss'

function Home() {
  return (
    <>
      <Disclaimer />
      <HandleInitialState component={Main} />
    </>
  )
}

export default Home
