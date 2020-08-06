/**
 * Serves production build artifacts.
 *
 * /!\ Only for development purposes, e.g. verifying that production build runs
 * on developer's machine.
 *
 * This server is very naive, slow and insecure. Real-world deployments should
 * use either a 3rd-party static hosting or a robust static server, such as
 * Nginx, instead.
 *
 */

import path from 'path'

import express, { Response } from 'express'

import allowMethods from 'allow-methods'
import history from 'connect-history-api-fallback'
import expressStaticGzip from 'express-static-gzip'

import { getenv } from '../../lib/getenv'
import { findModuleRoot } from '../../lib/findModuleRoot'

import { modifyHeaders } from '../../infra/lambda-at-edge/modifyOutgoingHeaders.lambda'

const { moduleRoot } = findModuleRoot()

const buildDir = path.join(moduleRoot, '.build', 'production', 'web')
const nextDir = path.join(buildDir, '_next')

export interface NewHeaders {
  [key: string]: { key: string; value: string }[]
}

function main() {
  const app = express()

  const expressStaticGzipOptions = { enableBrotli: true }

  const cacheNone = {
    ...expressStaticGzipOptions,
    serveStatic: {
      setHeaders: (res: Response) => res.set({ 'Cache-Control': 'no-cache' }),
    },
  }
  const cacheOneYear = {
    ...expressStaticGzipOptions,
    serveStatic: { maxAge: '31556952000', immutable: true },
  }

  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    const newHeaders = modifyHeaders({ request: req, response: res }) as NewHeaders
    Object.entries(newHeaders).forEach(([header, arr]) => {
      const [{ value }] = arr
      if (header.toLowerCase() === 'strict-transport-security') {
        return
      }
      res.set({ [header.toLowerCase()]: value })
    })
    next()
  })

  app.use(allowMethods(['GET', 'HEAD']))
  app.use(history())
  app.use('/_next', expressStaticGzip(nextDir, cacheOneYear))
  app.get('*', expressStaticGzip(buildDir, cacheNone))

  const port = getenv('WEB_PORT_PROD')
  app.listen(port, () => {
    console.info(`Server is listening on port ${port}`)
  })
}

main()
