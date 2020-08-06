import { execSync } from 'child_process'

import { getenv } from './getenv'

export function getGitCommitHashLocal() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
  } catch {
    return undefined
  }
}

export function getGitBranch() {
  return (
    getenv('GIT_BRANCH', null) ??
    getenv('BRANCH', null) ??
    getenv('TRAVIS_BRANCH', null) ??
    getenv('NOW_GITHUB_COMMIT_REF', null) ??
    getenv('VERCEL_GITHUB_COMMIT_REF', null) ??
    getenv('VERCEL_GITLAB_COMMIT_REF', null) ??
    getenv('VERCEL_BITBUCKET_COMMIT_REF', null) ??
    getenv('ZEIT_GITHUB_COMMIT_REF', null) ??
    getenv('ZEIT_GITLAB_COMMIT_REF', null) ??
    getenv('ZEIT_BITBUCKET_COMMIT_REF', null) ??
    getGitCommitHashLocal() ??
    ''
  )
}
