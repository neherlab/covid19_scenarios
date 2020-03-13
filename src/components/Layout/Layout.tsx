import React from 'react'

import { Location } from 'history'
import { connect } from 'react-redux'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import Loading from '../../pages/Loading'
import PageSwitcher from '../PageSwitcher/PageSwitcher'
import NavigationBar from './NavigationBar'

import links from '../../links'
import routes from '../../routes'

import { State } from '../../state/reducer'

const transitionClassNames = {
  enter: 'animated',
  enterActive: 'fadeIn',
  exit: 'animated',
  exitActive: 'fadeOut',
}

const transitionDuration = 150

interface LayoutProps {
  location: Location
}

function Layout({ location }: LayoutProps) {
  return (
    <div className="container-fluid">
      <div className="row">
        <NavigationBar navLinks={links} />
      </div>

      <div className="row">
        <TransitionGroup component={null}>
          <CSSTransition key={location.key} classNames={transitionClassNames} timeout={transitionDuration}>
            <main className="container-fluid absolute" role="main">
              <PageSwitcher location={location} routes={routes} loadingComponent={<Loading />} />
            </main>
          </CSSTransition>
        </TransitionGroup>
      </div>
    </div>
  )
}

const mapStateToProps = (state: State) => ({
  location: state.router.location,
})

export default connect(mapStateToProps)(Layout)
