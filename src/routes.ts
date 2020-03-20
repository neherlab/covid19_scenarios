import { PageRouteDesc } from './components/PageSwitcher/PageSwitcher'

export const HomePath = '/covid19/'

const routes: PageRouteDesc[] = [
  { path: HomePath, page: 'Home' },
  { path: '/covid19/about', page: 'About' },
  { path: '/covid19/team', page: 'Team' },
]

export default routes
