import passport from "../../../lib/passport-github-auth";
import nextConnect from "next-connect";
var session = require("express-session");

const auth = nextConnect()
  .use(
    session({
      secret: process.env.JWT_SALT,
      resave: false,
      saveUninitialized: true,
      cookie: { secure: true },
    })
  )
  .use((req, res, next) => {
    // Initialize mocked database
    // Remove this after you add your own database
    next();
  })
  .use(passport.initialize())
  .use(passport.session());

export default nextConnect()
  .use(auth)
  .get(
    passport.authenticate("github", {
      scope: ["profile", "email"],
    })
  );
