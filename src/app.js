const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");
const cookieSession = require("cookie-session");
require("dotenv").config();

const checkLogin = (req, res, next) => {
  const isLoggedIn = req.isAuthenticated() && req.user;
  if (!isLoggedIn) {
    return res.status(401).json({ error: "you must login!" });
  }
  next();
};
const authOption = {
  callbackURL: "/auth/google/callback",
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
};
const verifyCallback = (accessToken, refreshToken, profile, done) => {
  done(null, profile);
};

passport.use(new Strategy(authOption, verifyCallback));
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});
app.use(
  cookieSession({
    name: "session",
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.SECRET_ONE, process.env.SECRET_TWO],
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(helmet());
app.use(morgan("combined"));
app.use(cors());

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email"],
  })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/failure",
    successRedirect: "/",
    session: true,
  }),
  (req, res) => {
    console.log("amir");
  }
);
app.get("/secret", checkLogin, (req, res) => {
  return res.status(200).json({ message: "secret is 60!!" });
});
app.get("/failure", (req, res) => {
  return res.status(401).json({ error: "failed to login!" });
});
app.get("/logout", (req, res) => {
  req.logOut();
  return res.redirect("/");
});
app.get("/", (req, res) => {
  return res.sendFile(path.join(__dirname, "view", "index.html"));
});

module.exports = app;
