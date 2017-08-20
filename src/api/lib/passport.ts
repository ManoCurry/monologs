import * as passport from 'passport'
import * as passportGithub from 'passport-github'
import { User } from './db/models'

const GitHubStrategy = passportGithub.Strategy
const githubInfo = {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.BASE_URL + '/auth/github/callback',
  scope: 'user:email',
}

passport.serializeUser((user, done) => {
  done(null, user._id)
})

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user)
  })
})

passport.use(new GitHubStrategy(githubInfo,
  (accessToken, refreshToken, profile, cb) => {
    User
      .findOne({
        githubId: profile.id,
      })
      .then(user => {
        if (user == null) {
          return User
            .create({
              name: profile.displayName || profile.username,
              emails: profile.emails,
              githubId: profile.id,
              githubName: profile.username,
              photos: profile.photos,
            })
        }
        return user
      })
      .then(user => {
        cb(null, user)
      })
      .catch(err => {
        cb(err)
      })
  }
))

export default passport
