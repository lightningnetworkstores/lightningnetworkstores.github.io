const express = require('express')
const app = express()
const passport = require('passport')

const TwitterStrategy = require('passport-twitter').Strategy

app.use(require('cookie-parser')())
app.use(require('body-parser').urlencoded({ extended: true }))
app.use(
  require('express-session')({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: 'auto',
    },
  })
)
app.use(passport.initialize())
app.use(passport.session())

app.get('/login', passport.authenticate('twitter'))
app.get('/callback', passport.authenticate('twitter'), (req, res) => {
  res.redirect('/')
})

app.get('/user', (req, res) => {
  if (req.user) {
    return res.json(req.user)
  } else {
    return res.status(401).json({ message: 'Unauthorized' })
  }
})

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: process.env.TWITTER_CALLBACK_URL,
    },
    function (token, tokenSecret, profile, done) {
      profile.access_token = token
      profile.token_secret = tokenSecret
      return done(null, profile)
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user)
})
passport.deserializeUser((obj, done) => {
  done(null, obj)
})

app.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

module.exports = app
