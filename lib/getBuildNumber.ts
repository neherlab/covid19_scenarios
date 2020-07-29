import { getenv } from './getenv'

export function getBuildNumber() {
  return getenv('TRAVIS_BUILD_NUMBER', null) ?? getenv('BUILD_ID', null)
}
