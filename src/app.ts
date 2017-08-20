import * as express from 'express'
import * as nextServer from 'next'
import * as dotenv from 'dotenv'
import * as logger from 'morgan'
import * as path from 'path'

const dev = process.env.NODE_ENV !== 'production'
if (dev) {
  dotenv.config()
} else {
  dotenv.config({
    path: '.env.production',
  })
}

const nextApp = nextServer({
  dev,
  dir: path.join(__dirname, 'ssr'),
})
const handle = nextApp.getRequestHandler()

nextApp.prepare()
  .then(() => {
    const expressApp = express()
    const logTarget = dev
      ? /^(?!\/_next\/on-demand-entries-ping).+/
      : '*'
    expressApp.use(logTarget, logger('dev'))

    if (!dev) {
      const rootRouter = require('./apis/rootRouter')
      expressApp.all(/\/api|\/auth|\/files/, (req, res, next) => {
        req.url = req.baseUrl + req.url
        req.path = req.baseUrl + req.path
        req.baseUrl = '/'
        next()
      }, rootRouter)

    } else {
      const proxy = require('http-proxy-middleware')
      expressApp.use('/api', proxy('http://127.0.0.1:3001'))
      expressApp.use('/auth', proxy('http://127.0.0.1:3001'))
    }

    expressApp.get('*', (req, res) => {
      return handle(req, res)
    })

    expressApp.listen(3000, (err) => {
      if (err) throw err
      // tslint:disable-next-line:no-console
      console.log('> Ready on http://127.0.0.1:3000')
    })
  })
