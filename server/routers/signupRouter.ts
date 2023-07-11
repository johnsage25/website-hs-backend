import { router, procedure } from "../trpc";
import { z } from "zod";
import { SignUpInterface } from "../../Types/SignUpInterface";
import { BillingAddress, Customers, Sessions } from "../../database";
import { SignUpMail } from "../../mail/component/SignupMail";
const bcrypt = require("bcrypt");
var randomstring = require("randomstring");
const lookup = require("country-code-lookup");
var geoip = require("geoip-lite");
var jwt = require("jsonwebtoken");
var JWT_SALT = process.env.JWT_SALT;
import { serialize } from "cookie";
import { SignUpBillingInterface } from "../../Types/SignUpBillingInterface";
import { SignupMobileInterface } from "../../Types/SignupMobileInterface";
let APP_DOMAIN = process.env.APP_DOMAIN;
var mongoose = require("mongoose");
var speakeasy = require("speakeasy");
var secret = speakeasy.generateSecret({ length: 20 });
const { v4: uuidv4 } = require("uuid");
import StringCrypto from "string-crypto";
import { signJwt } from "../../node/JwtAuth";

var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require("twilio")(accountSid, authToken, {
  lazyLoading: true,
});

export const signupRouter = router({
  create: procedure
    .input(z.custom<SignUpInterface>())
    .mutation(async ({ ctx, input }: { ctx: any; input: SignUpInterface }) => {
      let formData: SignUpInterface = input;

      const saltRounds = 10;
      // encrypt user password
      let password = await new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, function (err: any, salt: any) {
          bcrypt.hash(formData.password, salt, function (err: any, hash: any) {
            resolve(hash);
          });
        });
      });

      let geo = geoip.lookup("69.162.81.155");
      let country_name = lookup.byInternet(geo.country);

      var id = mongoose.Types.ObjectId();

      let mailActivationSalt = uuidv4();

      const { email, tos } = formData;

      var nameMatch = email?.match(/^([^@]*)@/);

      let customer = await new Customers({
        _id: id,
        email,
        username: nameMatch!![1],
        verificationString: mailActivationSalt,
        isMobileVerify: false,
        otp: "",
        isEmailVerify: false,
        country: country_name.country,
        iso2: country_name.iso2,
        secret2fa: secret.base32,
        encoding: "base32",
        password,
        tos,
      });

      let d = await customer
        .save()
        .then(async (res: any) => {
          const { encryptString } = new StringCrypto();

          let encryptedString = encryptString(
            JSON.stringify({
              _id: res._id,
              email: res.email,
              date: new Date(),
            }),
            JWT_SALT
          );

          let activationLink = `${APP_DOMAIN}/activate?code=${encryptedString}`;
          SignUpMail(email, activationLink);

          // Session model

          const session: any = await new Promise((resolve, reject) => {
            Sessions.create({
              _id: mongoose.Types.ObjectId(),
              customer: res._id,
              createdAt: new Date(),
              updatedAt: new Date(),
              browser_signature: "",
              ...geo,
              latitude: geo.ll,
            })
              .then(async (result: any) => {
                let token = await signJwt(
                  {
                    session_id: result._id,
                    customer_id: res._id,
                    created_at: new Date(),
                  },
                  JWT_SALT,
                  "30d"
                );

                resolve(token);
              })
              .catch((err: any) => {
                // console.log(err);
              });
          });

          if (session) {
            ctx.res.setHeader(
              "Set-Cookie",
              serialize("hostspacing-session", session, {
                path: "/",
                maxAge: 60 * 60 * 60 * 1000,
                httpOnly: true,
              })
            );
          }

          return {
            error: false,
            status: "success",
            ...res,
          };
        })
        .catch((error: any) => {
          if (error.code) {
            return {
              error: true,
              status: "error",
              duplicated: true,
            };
          } else {
            return {
              error: true,
              status: "error",
              duplicated: false,
            };
          }
        });

      return { ...d };
    }),

  billing: procedure
    .input(z.custom<SignUpBillingInterface>())
    .mutation(({ ctx, input }: { ctx: any; input: SignUpBillingInterface }) => {
      return new Promise(async (resolve, reject) => {
        Customers.updateOne(
          { _id: ctx?.session.customer[0]._id },
          {
            firstname: input?.firstname,
            lastname: input?.lastname,
          }
        )
          .then(async (result: any) => {
            // console.log(result);

            BillingAddress.create({
              _id: mongoose.Types.ObjectId(),
              customer: ctx?.session!!.customer[0]._id,
              ...input,
            })
              .then((result: any) => {
                resolve({
                  status: "success",
                  error: false,
                  ...result,
                });
              })
              .catch((err: any) => {
                resolve({
                  status: "error",
                  error: true,
                  ...err,
                });
              });
          })
          .catch((err: any) => {
            // console.log(err);
          });
      });
    }),

  verifyMobile: procedure
    .input(z.custom<SignupMobileInterface>())
    .mutation(
      async ({ ctx, input }: { ctx: any; input: SignupMobileInterface }) => {
        return await new Promise(async (resolve, reject) => {
          if (input.mobile == "none") {
            let customer = await Customers.findOne({
              _id: ctx?.session.customer[0]._id,
            });

            client.verify.v2
              .services("VA2ee475901d3a06d7ad4a2934b1e7f7c1")
              .verifications.create({
                to: `+${customer.mobile}`,
                channel: "sms",
              })
              .then((verification: any) => {
                resolve({
                  opt_screen: true,
                });
              })
              .catch((err: any) => {
                resolve({
                  opt_screen: false,
                  ...err,
                });
              });

            return;
          }

          await Customers.update(
            { _id: ctx?.session.customer[0]._id },
            { mobile: input.mobile }
          )
            .then((result: any) => {
              client.verify.v2
                .services("VA2ee475901d3a06d7ad4a2934b1e7f7c1")
                .verifications.create({
                  to: `+${input.mobile}`,
                  channel: "sms",
                })
                .then((verification: any) => {
                  resolve({
                    opt_screen: true,
                  });
                })
                .catch((err: any) => {
                  resolve({
                    opt_screen: false,
                    ...err,
                  });
                });
            })
            .catch((err: any) => {
              reject({
                opt_screen: false,
                ...err,
              });
            });
        });
      }
    ),

  verifyOtpMobile: procedure
    .input(z.custom<SignupMobileInterface>())
    .mutation(
      async ({ ctx, input }: { ctx: any; input: SignupMobileInterface }) => {
        let customer = await Customers.findOne({
          _id: ctx?.session.customer[0]._id,
        });

        return new Promise((resolve, reject) => {
          client.verify.v2
            .services("VA2ee475901d3a06d7ad4a2934b1e7f7c1")
            .verificationChecks.create({
              to: `+${customer.mobile}`,
              code: input.code,
            })
            .then(async (verification_check: any) => {
              if (verification_check.status) {
                await Customers.update(
                  { _id: ctx?.session.customer[0]._id },
                  { isMobileVerify: true }
                );
                resolve({
                  status: true,
                  hasError: false,
                });
              } else {
                resolve({
                  status: false,
                  hasError: false,
                });
              }
            })
            .catch((err: any) => {
              reject({
                status: false,
                hasError: true,
              });
            });
        });
      }
    ),
});
