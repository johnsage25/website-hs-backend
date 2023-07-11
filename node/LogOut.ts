import type { NextApiRequest, NextApiResponse } from "next";
import _ from "lodash";
import { Sessions } from "../database";
import { verifyJwt } from "./JwtAuth";
const cookie = require("cookie");

var JWT_SALT = process.env.JWT_SALT;
var jwt = require("jsonwebtoken");

/// checking user session from database
var timezones = require("timezones-list");

export const LogOut = async (req?: NextApiRequest, res?: NextApiResponse) => {
  return await new Promise((resolve, reject) => {
    if (_.isUndefined(req?.cookies["hostspacing-session"])) {
      resolve(null);
    }

    if (!_.isEmpty(req?.cookies["hostspacing-session"])) {
      verifyJwt(req?.cookies["hostspacing-session"], JWT_SALT)
        .then((result: any) => {
          res?.setHeader("Set-Cookie", [
            cookie.serialize("hostspacing-session", "", {
              expires: new Date(0),
              path: "/",
            }),
          ]);

          resolve({ status: false, error: true });
        })
        .catch((err) => {
          reject(null);
        });
    }
  });
};
