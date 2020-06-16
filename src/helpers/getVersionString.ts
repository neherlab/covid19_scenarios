export function getVersionString() {
  const BRANCH_NAME = process.env.BRANCH_NAME ?? ''
  const PACKAGE_VERSION = process.env.PACKAGE_VERSION ?? ''
  const REVISION = process.env.REVISION ?? ''
  const BUILD_NUMBER = process.env.BUILD_NUMBER ?? ''

  let version = PACKAGE_VERSION
  let meta: string[] = []
  if (REVISION && REVISION.length >= 7) {
    meta = [...meta, `rev: ${REVISION.slice(0, 7)}`]
  }

  if (BUILD_NUMBER) {
    meta = [...meta, `build: ${BUILD_NUMBER}`]
  }

  if (BRANCH_NAME && !BRANCH_NAME.startsWith('prod')) {
    meta = [...meta, `env: ${BRANCH_NAME}`]
  }

  const metaStr = meta.join(', ')
  if (metaStr.length > 0) {
    version = `version ${version} (${metaStr})`
  }

  return version
}
