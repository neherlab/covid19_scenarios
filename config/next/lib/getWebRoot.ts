import { isEmpty } from 'lodash'

import { getenv } from '../../../lib/getenv'

const WEB_SCHEMA = getenv('WEB_SCHEMA')
const WEB_HOST = getenv('WEB_HOST')
const WEB_PORT_DEV = getenv('WEB_PORT_DEV')
const WEB_PORT_PROD = getenv('WEB_PORT_PROD')

export function getWebRoot({ production }: { production: boolean }) {
  let root = `${WEB_SCHEMA}://${WEB_HOST}`

  if (production && !isEmpty(WEB_PORT_PROD) && WEB_PORT_PROD !== 'null') {
    root = `${root}:${WEB_PORT_PROD}`
  } else if (!isEmpty(WEB_PORT_DEV)) {
    root = `${root}:${WEB_PORT_DEV}`
  }

  return root
}
