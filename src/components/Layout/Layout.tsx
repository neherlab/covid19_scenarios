import React, { PropsWithChildren, HTMLProps } from 'react'

import { Container } from 'reactstrap'

import { NavigationBar } from './NavigationBar'
import Footer from './Footer'

export function Layout({ children }: PropsWithChildren<HTMLProps<HTMLDivElement>>) {
  return (
    <Container fluid className="layout-container px-0">
      <header className="row navbar-container d-print-none">
        <NavigationBar />
      </header>

      <div className="row main-wrapper">
        <main className="main container-fluid absolute" role="main">
          {children}
        </main>
      </div>

      <footer className="row d-print-none footer">
        <Footer />
      </footer>
    </Container>
  )
}
