import React from 'react'

import { Location } from 'history'
import { connect } from 'react-redux'

import { selectLocation } from '../../state/router/router.selectors'

import Loading from '../../pages/Loading'
import PageSwitcher from '../PageSwitcher/PageSwitcher'
import { NavigationBar } from './NavigationBar'

import routes from '../../routes'

import { State } from '../../state/reducer'

import Footer from './Footer'

import './Layout.scss'

interface LayoutProps {
  location: Location
}

const mapStateToProps = (state: State) => ({
  location: selectLocation(state),
})

export default connect(mapStateToProps)(Layout)

function Layout({ location }: LayoutProps) {
  return (
    <div className="container-fluid">
      <header className="row d-print-none">
        <NavigationBar />
      </header>

      <div className="row main-wrapper">
        <main className="main container-fluid absolute" role="main">
          <PageSwitcher location={location} routes={routes} loadingComponent={<Loading />} />
        </main>
      </div>

      <footer className="row d-print-none footer">
        <Footer />
      </footer>
    </div>
  )
}
