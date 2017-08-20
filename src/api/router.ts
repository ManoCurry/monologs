import * as express from 'express'
import * as cookieParser from 'cookie-parser'
import * as bodyParser from 'body-parser'
import * as session from 'express-session'
import * as FileStore from 'session-file-store'
import * as logger from 'morgan'
import passport from './lib/passport'
import authRouter from './routes/auth'

const dev = process.env.NODE_ENV !== 'production'

const router = express.Router()
const Store = FileStore(session)

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: false}))
router.use(cookieParser(process.env.APP_SECRET))

router.use(session({
  secret: process.env.APP_SECRET,
  store: new Store({
    path: '/tmp/sessions',
    ttl: 3600 * 24 * 14,
  }),
  resave: false,
  saveUninitialized: false,
}))
router.use(passport.initialize())
router.use(passport.session())
router.get('/api', (req, res) => {
  res.send('hello')
})

router.use('/auth', authRouter)

router.use((req, res, next) => {
  const err = new Error('Not Found');
  (err as any).status = 404
  next(err)
})

// error handler
router.use((error, req, res, next) => {
  // tslint:disable-next-line:no-console
  console.error(error)
  // set locals, only providing error in development
  res.locals.message = error.message
  res.locals.error = dev ? error : {}

  // render the error page
  res.status(error.status || 500)
  res.json({
    message: error.message,
  })
})

export default router
