import { execSync } from 'child_process'

import { getenv } from './getenv'

export function getGitCommitHashLocal() {
  try {
    return execSync('git rev-parse HEAD').toString().trim()
  } catch {
    return undefined
  }
}

export function getGitCommitHash() {
  return (
    getenv('GIT_COMMIT', null) ??
    getenv('GIT_COMMIT_HASH', null) ??
    getenv('TRAVIS_COMMIT', null) ??
    getenv('NOW_GITHUB_COMMIT_SHA', null) ??
    getenv('GITHUB_SHA', null) ??
    getenv('COMMIT_REF', null) ??
    getenv('VERCEL_GITHUB_COMMIT_SHA', null) ??
    getenv('VERCEL_GITLAB_COMMIT_SHA', null) ??
    getenv('VERCEL_BITBUCKET_COMMIT_SHA', null) ??
    getenv('ZEIT_GITHUB_COMMIT_SHA', null) ??
    getenv('ZEIT_GITLAB_COMMIT_SHA', null) ??
    getenv('ZEIT_BITBUCKET_COMMIT_SHA', null) ??
    getGitCommitHashLocal()
  )
}
