import { execSync } from 'child_process'

import { getenv } from './getenv'

export function getGitCommitHash() {
  return (
    getenv('TRAVIS_COMMIT', null) ??
    getenv('NOW_GITHUB_COMMIT_SHA', null) ??
    getenv('VERCEL_GITHUB_COMMIT_SHA', null) ??
    execSync('git rev-parse HEAD').toString().trim()
  )
}
