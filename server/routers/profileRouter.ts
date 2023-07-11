import { initTRPC } from "@trpc/server";
import { z } from "zod";
import {
  BillingAddress,
  Customers,
  EventsNotification,
  SSHKeys,
  mongoose,
} from "../../database";
import { BillingType } from "../../Types/CustomerType";
import { SignUpBillingInterface } from "../../Types/SignUpBillingInterface";
import { procedure, router } from "../trpc";
import _ from "lodash";
import { ProfileEmailUpdate } from "../../mail/component/ProfileEmailUpdate";
const { v4: uuidv4 } = require("uuid");
let APP_DOMAIN = process.env.APP_DOMAIN;
var JWT_SALT = process.env.JWT_SALT;
import StringCrypto from "string-crypto";
import { Enabled2fa } from "../../mail/component/Enabled2fa";
import { Disabled2fa } from "../../mail/component/Disabled2fa";
import { SSHInferface } from "../../Types/SSHInferface";
var speakeasy = require("speakeasy");
var generatorPassword = require("generate-password");
var fingerprint = require("ssh-fingerprint");
var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require("twilio")(accountSid, authToken, {
  lazyLoading: true,
});

export const t = initTRPC.create();
export const profileRouter = router({
  //updating username

  usernameUpdate: procedure
    // using zod schema to validate and infer input values
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }: { ctx: any; input: any }) => {
      return await new Promise(async (resolve, reject) => {
        // updating username
        Customers.updateOne(
          { _id: ctx.session.customer[0]._id },
          { username: input.name }
        )
          .then((result: any) => {
            // creating notification
            EventsNotification.create({
              _id: mongoose.Types.ObjectId(),
              createdAt: new Date(),
              updatedAt: new Date(),
              opened: false,
              read: false,
              message: `User *${input.name}* has been updated`,
              custumer: ctx.session.customer[0]._id,
            })
              .then((result: any) => {
                // // console.log(result);
              })
              .catch((err: any) => {
                // console.log(err);
              });

            resolve(result);
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }),

  // update email
  updateEmail: procedure
    .input(
      z.object({
        email: z.string(),
      })
    )
    .mutation(async ({ ctx, input }: { ctx: any; input: any }) => {
      //database details
      return await new Promise(async (resolve, reject) => {
        let mailActivationSalt = uuidv4();

        // updating username
        Customers.updateOne(
          { _id: ctx.session.customer[0]._id },
          { email: input.email, isEmailVerify: false }
        )
          .then((result: any) => {
            EventsNotification.create({
              _id: mongoose.Types.ObjectId(),
              createdAt: new Date(),
              updatedAt: new Date(),
              opened: false,
              read: false,
              message: `User email *${input.email}* has been updated but will require *verification*.`,
              custumer: ctx.session.customer[0]._id,
            })
              .then((result: any) => {
                const { encryptString } = new StringCrypto();

                let encryptedString = encryptString(
                  JSON.stringify({
                    _id: ctx.session.customer[0]._id,
                    email: ctx.session.customer[0].email,
                    date: new Date(),
                  }),
                  JWT_SALT
                );

                let activationLink = `${APP_DOMAIN}/activate?code=${encryptedString}`;
                ProfileEmailUpdate(
                  input.email,
                  ctx.session.customer[0].email,
                  activationLink
                );
              })
              .catch((err: any) => {
                // console.log(err);
              });

            resolve(result);
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }),

  ///updating timezone
  updateTimezone: procedure

    .input(
      z.object({
        timezone: z.string(),
      })
    )
    .mutation(async ({ ctx, input }: { ctx: any; input: any }) => {
      //database details
      return await new Promise(async (resolve, reject) => {
        // updating username
        Customers.updateOne(
          { _id: ctx.session.customer[0]._id },
          { timezone: input.timezone }
        )
          .then((result: any) => {
            resolve(result);
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }),

  // google authentication

  removeAuth: procedure
    .input(
      z.object({
        action: z.string(),
      })
    )
    .mutation(async ({ ctx, input }: { ctx: any; input: any }) => {
      return await new Promise(async (resolve, reject) => {
        // updating username
        Customers.updateOne(
          { _id: ctx.session.customer[0]._id },
          input.action == "google"
            ? { googleAuthId: "", googleAuth: false }
            : { githubAuth: false, githubAuthId: "" }
        )
          .then((result: any) => {
            resolve(result);
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }),

  create2fa: procedure
    .input(
      z.object({
        action: z.string(),
      })
    )
    .mutation(async ({ ctx, input }: { ctx: any; input: any }) => {
      return await new Promise(async (resolve, reject) => {
        // updating username
        var QRCode = require("qrcode");
        var secret = speakeasy.generateSecret({ length: 20 });

        let image2fa = await new Promise((resolve, reject) => {
          var twofaurlcode = speakeasy.otpauthURL({
            secret: secret.base32,
            label: `HostSpacing (${ctx.session.customer[0].email})`,
            algorithm: "SHA512",
          });

          QRCode.toDataURL(twofaurlcode, function (err: any, url: any) {
            if (!err) {
              resolve(url);
            } else {
              resolve("");
            }
          });
        });

        var recoveryCodes = generatorPassword.generateMultiple(20, {
          length: 8,
          uppercase: false,
          numbers: true,
        });

        Customers.updateOne(
          { _id: ctx.session.customer[0]._id },
          { secret2fa: secret.base32, recoveryCodes: recoveryCodes }
        )
          .then((result: any) => {
            resolve({ secret: secret, image2fa, recoveryCodes });
          })
          .catch((err: any) => {
            reject({ secret: null, image2fa: "" });
          });
      });
    }),
  enable2fa: procedure
    .input(
      z.object({
        code: z.string(),
      })
    )
    .mutation(async ({ ctx, input }: { ctx: any; input: any }) => {
      return await new Promise(async (resolve, reject) => {
        // updating username

        var tokenValidates = speakeasy.totp.verify({
          secret: ctx.session.customer[0].secret2fa,
          encoding: "ascii",
          token: input.code,
          window: 2,
        });

        if (tokenValidates) {
          Customers.updateOne(
            { _id: ctx.session.customer[0]._id },
            { twoFactorEnabled: true }
          )
            .then(async (result: any) => {
              let customer = await Customers.findOne(
                ctx.session.customer[0]._id
              );
              Enabled2fa(customer);
              resolve({ status: true, customer });
            })
            .catch((err: any) => {
              reject(err);
            });
        } else {
          resolve({ status: false });
        }
      });
    }),
  disable2fa: procedure
    .input(
      z.object({
        action: z.string(),
      })
    )
    .mutation(async ({ ctx, input }: { ctx: any; input: any }) => {
      return await new Promise(async (resolve, reject) => {
        // updating username
        Customers.updateOne(
          { _id: ctx.session.customer[0]._id },
          { twoFactorEnabled: false }
        )
          .then(async (result: any) => {
            let customer = await Customers.findOne(ctx.session.customer[0]._id);

            Disabled2fa(customer);
            resolve({ status: true, customer });
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }),

  verifyMobile: procedure
    .input(
      z.object({
        number: z.string(),
      })
    )
    .mutation(async ({ ctx, input }: { ctx: any; input: any }) => {
      return await new Promise(async (resolve, reject) => {
        let customer = await Customers.findOne({
          mobile: input.number,
        });

        if (customer) {
          resolve({
            opt_screen: false,
          });

          return;
        }

        client.verify.v2
          .services("VA2ee475901d3a06d7ad4a2934b1e7f7c1")
          .verifications.create({
            to: `+${input.number}`,
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
      });
    }),

  updateMobile: procedure
    .input(
      z.object({
        number: z.string(),
        code: z.string(),
      })
    )
    .mutation(async ({ ctx, input }: { ctx: any; input: any }) => {
      return new Promise((resolve, reject) => {
        client.verify.v2
          .services("VA2ee475901d3a06d7ad4a2934b1e7f7c1")
          .verificationChecks.create({
            to: `+${input.number}`,
            code: input.code,
          })
          .then(async (verification_check: any) => {
            if (verification_check.status) {
              await Customers.update(
                { _id: ctx?.session.customer[0]._id },
                { isMobileVerify: true, mobile: input.number }
              );
              resolve({
                status: true,
                number: input.number,
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
    }),

  sshlist: procedure
    // using zod schema to validate and infer input values
    .input(z.object({ text: z.string().nullish() }).nullish())
    .query(async ({ ctx, input }: { ctx: any; input: any }) => {
      return new Promise(async (resolve, reject) => {
        SSHKeys.find({ customer: [ctx?.session.customer[0]._id] })
          .sort({ createdAt: -1 })
          .then((result: any) => {
            resolve(result);
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }),

  addSSH: procedure
    .input(z.custom<SSHInferface>())
    .mutation(async ({ ctx, input }: { ctx: any; input: any }) => {
      return new Promise(async (resolve, reject) => {
        SSHKeys.create(
          {
            _id: mongoose.Types.ObjectId(),
            fingerprint: fingerprint(input.key),
            key: input.key,
            customer: ctx?.session.customer[0]._id,
            ...input,
          }
        )
          .then((result: any) => {
            resolve(result);
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }),

  updateSSH: procedure
    .input(z.custom<SSHInferface>())
    .mutation(async ({ ctx, input }: { ctx: any; input: SSHInferface }) => {
      return new Promise(async (resolve, reject) => {
        SSHKeys.updateOne(
          {
            _id: input._id,
          },
          {
            ...input,
          }
        )
          .then((result: any) => {
            resolve(result);
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }),

  removeSSH: procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }: { ctx: any; input: any }) => {
      return new Promise((resolve, reject) => {
        SSHKeys.deleteOne({ _id: input.id })
          .then((result: any) => {
            resolve(result);
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }),

  /// settings

  enableEmailNotication: procedure
    .input(
      z.object({
        enable: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }: { ctx: any; input: any }) => {
      return new Promise((resolve, reject) => {
        Customers.update(
          { _id: ctx?.session.customer[0]._id },
          { mailNotification: input.enable }
        )
          .then((result: any) => {
            resolve(result);
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }),

  enableDarkMode: procedure
    .input(
      z.object({
        enable: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }: { ctx: any; input: any }) => {
      return new Promise((resolve, reject) => {
        Customers.update(
          { _id: ctx?.session.customer[0]._id },
          { darkMode: input.enable }
        )
          .then((result: any) => {
            resolve(result);
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }),

  enableTypeToConfirm: procedure
    .input(
      z.object({
        enable: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }: { ctx: any; input: any }) => {
      return new Promise((resolve, reject) => {
        Customers.update(
          { _id: ctx?.session.customer[0]._id },
          { typeToConfirm: input.enable }
        )
          .then((result: any) => {
            resolve(result);
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }),
});
