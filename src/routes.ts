import { PageRouteDesc } from './components/PageSwitcher/PageSwitcher'

const routes: PageRouteDesc[] = [
  { path: '/', page: 'Home' },
  { path: '/about', page: 'About' },
  { path: '/acknowledgements', page: 'Acknowledgements' },
  { path: '/faq', page: 'Faq' },
  { path: '/updates', page: 'Updates' },
]

if (process.env.NODE_ENV !== 'production') {
  routes.push({ path: '/test_standalone', page: 'TestStandalone' })
}

export default routes
