
const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const passport = require('passport');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./user.model.js');

app.set('view engine', 'ejs');
app.set("views", path.resolve("./views"))

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET' 
}));

app.get('/', function(req, res) {
  res.render('pages/auth');
});


let userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

app.get('/success', (req, res) => res.send(userProfile));
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


 
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.redirect_uri_mismatch
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));
console.log(process.env.redirect_uri_mismatch)
 
app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
app.get('/api/google/login', 
  passport.authenticate('google', { failureRedirect: '/error' }),
 async (req, res) => {
    // Successful authentication, redirect success.
    req.session.regenerate(async() => {
     const user = req.user;
      console.log(req.user)
       await User.create({
        email:user.emails?.[0]?.value || user.emails?.value || req.user.email,
        displayName:user.displayName,
        picture:user.photos[0]?.value || user?.picture
    })
      res.redirect('/success');
    });
  });



module.exports = app;