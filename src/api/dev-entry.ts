import * as dotenv from 'dotenv'

const dev = process.env.NODE_ENV !== 'production'
if (dev) {
  dotenv.config()
} else {
  dotenv.config({
    path: '.env.production',
  })
}

import * as express from 'express'
import router from './router'
import * as path from 'path'

const app = express()
app.use(router)

app.listen(3001, (err) => {
  if (err) throw err
  // tslint:disable-next-line:no-console
  console.log('API server is on http://127.0.0.1:3001')
})
