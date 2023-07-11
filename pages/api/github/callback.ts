import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { Customers } from "../../../database";
import passport from "../../../lib/passport-google-auth";
import { AuthCheck } from "../../../node/AuthCheck";
var session = require("express-session");

export default nextConnect()
  .use(
    session({
      secret: process.env.JWT_SALT,
      resave: false,
      saveUninitialized: true,
      cookie: { secure: true },
    })
  )
  .get(
    passport.authenticate('github', { failureRedirect: '/profile/authentication' }),
    async (req: NextApiRequest & { user: any }, res: NextApiResponse) => {
      // you can save the user session here. to get access to authenticated user through req.user

      let session: any = await AuthCheck(req, res);

      // console.log(req.user);

      if (session) {
        // setting current active user to update
        let sp: any = await new Promise((resolve, reject) => {
          Customers.updateOne(
            { _id: session.customer[0]._id },
            { githubAuth: true, githubAuthId: req.user.id }
          )
            .then((result: any) => {
              resolve(result);
            })
            .catch((err: any) => {
              resolve({});
            });
        });

        if (sp) {
          res.redirect("/profile/authentication");
        }
      } else {


        // creating a complete customer details
      }

      res.json({ user: req.user });
    }
  );
