import { getenv } from './getenv'

export function getBuildUrl() {
  return getenv('TRAVIS_BUILD_WEB_URL', null)
}
