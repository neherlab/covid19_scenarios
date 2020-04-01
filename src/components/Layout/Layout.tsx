import React from 'react'
import { useSelector } from 'react-redux'

import { Location } from 'history'
import { connect } from 'react-redux'

import Loading from '../../pages/Loading'
import PageSwitcher from '../PageSwitcher/PageSwitcher'
import NavigationBar from './NavigationBar'

import { LoginForm } from '../LoginForm/LoginForm'
import { SignupForm } from '../SignupForm/SignupForm'

import links from '../../links'
import routes from '../../routes'

import { State } from '../../state/reducer'

import './Layout.scss'

interface LayoutProps {
  location: Location
}

function Layout({ location }: LayoutProps) {
  const loginVisible = useSelector(({ ui }: State) => ui.loginFormVisible)
  const signupVisible = useSelector(({ ui }: State) => ui.signupFormVisible)

  console.log('loginVisible', loginVisible)
  console.log('signupVisible', signupVisible)

  return (
    <div className="container-fluid">
      <header className="row">
        <NavigationBar navLinks={links} />
      </header>

      <div className="row">
        <main className="container-fluid absolute" role="main">
          <PageSwitcher location={location} routes={routes} loadingComponent={<Loading />} />
        </main>
      </div>

      {loginVisible && <LoginForm />}
      {signupVisible && <SignupForm />}
    </div>
  )
}

const mapStateToProps = (state: State) => ({
  location: state.router.location,
})

export default connect(mapStateToProps)(Layout)
