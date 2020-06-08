import { execSync } from 'child_process'

import { getenv } from './getenv'

export function getGitBranch() {
  return (
    getenv('TRAVIS_BRANCH', null) ??
    getenv('NOW_GITHUB_COMMIT_REF', null) ??
    getenv('VERCEL_GITHUB_COMMIT_REF', null) ??
    execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
  )
}
