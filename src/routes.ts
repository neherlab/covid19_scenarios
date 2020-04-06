import { PageRouteDesc } from './components/PageSwitcher/PageSwitcher'

const routes: PageRouteDesc[] = [
  { path: '/', page: 'Home' },
  { path: '/saved', page: 'SavedScenarios' },
  { path: '/about', page: 'About' },
  { path: '/acknowledgements', page: 'Acknowledgements' },
  { path: '/faq', page: 'Faq' },
  { path: '/updates', page: 'Updates' },
]

export default routes
