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

import { findModuleRoot } from '../../lib/findModuleRoot'

import { NEW_HEADERS } from '../../infra/lambda-at-edge/modifyOutgoingHeaders.lambda'

import routes from '../routes'

const { moduleRoot } = findModuleRoot()

const buildDir = path.join(moduleRoot, '.build', 'production', 'web')
const assetsDir = path.join(buildDir, 'assets')
const contentDir = path.join(buildDir, 'content')
const sourcemapDir = path.join(buildDir, '..', 'sourcemaps')

const pages = routes.map(route => route.path)

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
    Object.entries(NEW_HEADERS).forEach(([header, value]) => {
      if (header.toLowerCase() === 'strict-transport-security') {
        return
      }
      res.set({ [header.toLowerCase()]: value })
    })
    next()
  })

  app.use(allowMethods(['GET', 'HEAD']))
  app.use(history())
  app.use('/assets', expressStaticGzip(assetsDir, cacheOneYear))
  app.use('/content', expressStaticGzip(contentDir, cacheOneYear))
  app.use('/sourcemaps', expressStaticGzip(sourcemapDir, cacheOneYear))
  app.use(pages, expressStaticGzip(buildDir, cacheOneYear))
  app.get('*', expressStaticGzip(buildDir, cacheNone))

  const port = '8080'
  app.listen(port, () => {
    console.info(`Server is listening on port ${port}`)
  })
}

main()
