import React from 'react'

import { Location } from 'history'
import { connect } from 'react-redux'

import Loading from '../../pages/Loading'
import PageSwitcher from '../PageSwitcher/PageSwitcher'
import NavigationBar from './NavigationBar'

import links from '../../links'
import routes from '../../routes'

import { State } from '../../state/reducer'

import './Layout.scss'

interface LayoutProps {
  location: Location
}

function Layout({ location }: LayoutProps) {
  return (
    <div className="container-fluid">
      <header className="row d-print-none">
        <NavigationBar navLinks={links} />
      </header>

      <div className="row">
        <main className="container-fluid absolute" role="main">
          <PageSwitcher location={location} routes={routes} loadingComponent={<Loading />} />
        </main>
      </div>
    </div>
  )
}

const mapStateToProps = (state: State) => ({
  location: state.router.location,
})

export default connect(mapStateToProps)(Layout)
