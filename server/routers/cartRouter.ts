import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { procedure, router } from "../trpc";
import _ from "lodash";
import { Cart, Products, Sessions, VmCart, mongoose } from "../../database";
import { serialize } from "cookie";
import { CreateNodeInterface } from "../../Types/CreateNodeInterface";
var JWT_SALT = process.env.JWT_SALT;
var jwt = require("jsonwebtoken");

export const t = initTRPC.create();

export const cartRouter = t.router({
  domainCart: procedure
    .input(
      z
        .object({
          text: z.string().nullish(),
        })
        .nullish()
    )
    .query(({ ctx, input }: { ctx: any; input: any }) => {
      let sessionId = ctx?.req?.cookies["cart"] || null;

      return new Promise((resolve, reject) => {
        Cart.findOne({ _id: sessionId })
          .then((result: any) => {
            resolve(result);
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }),
  updateApp: procedure
    // using zod schema to validate and infer input values
    .input(
      z.object({
        select: z.string(),
      })
    )
    .mutation(({ ctx, input }: { ctx: any; input: any }) => {
      let productId = ctx.req?.cookies["cart"] || null;

      return new Promise((resolve, reject) => {
        Cart.update({ _id: productId }, { preinstall: input.select })
          .then((result: any) => {
            Cart.findOne({ _id: productId })
              .populate([{path: "product", populate: 'pricing'}, "ssl", "customer"])
              .then((res: any) => {
                resolve(res);
              })
              .catch((er: any) => {
                reject(er);
              });
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }),

  updateSSL: procedure
    // using zod schema to validate and infer input values
    .input(
      z.object({
        name: z.string(),
        sslId: z.string(),
      })
    )
    .mutation(({ ctx, input }: { ctx: any; input: any }) => {
      let productId = ctx.req?.cookies["cart"] || null;
      return new Promise((resolve, reject) => {
        Cart.update(
          { _id: productId },
          { sslName: input.name, ssl: input.sslId }
        )
          .then((result: any) => {
            resolve(result);
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }),

  updateBackup: procedure

    .input(
      z.object({
        state: z.boolean(),
      })
    )
    .mutation(({ ctx, input }: { ctx: any; input: any }) => {
      let cartSession = ctx.req?.cookies["cart"] || null;

      return new Promise((resolve, reject) => {
        Cart.update({ _id: cartSession }, { backup: input.state })
          .then((result: any) => {
            Cart.findOne({ _id: cartSession })
              .populate([{path: "product", populate: 'pricing'}, "ssl", "customer"])
              .then((res: any) => {
                resolve(res);
              })
              .catch((er: any) => {
                reject(er);
              });
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }),

  cartMiniBox: procedure
    .input(
      z
        .object({
          text: z.string().nullish(),
        })
        .nullish()
    )
    .query(({ ctx, input }: { ctx: any; input: any }) => {
      let productId = ctx.req?.cookies["cart"] || null;

      return new Promise((resolve, reject) => {
        Cart.findOne({ _id: productId })
          .populate([{path: "product", populate: 'pricing'}, "ssl"])
          .then((result: any) => {
            // // console.log(result);

            resolve(result);
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }),

  deleteTldOrder: procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }: { ctx: any; input: any }) => {
      let sessionId = ctx?.req?.cookies["cart"] || null;

      return new Promise(async (resolve, reject) => {
        const parent = await Cart.findById(sessionId);

        Cart.updateOne(
          { _id: sessionId },
          {
            $pull: {
              domainSelected: { _id: mongoose.Types.ObjectId(input.id) },
            },
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

  updateTerm: procedure
    .input(
      z.object({
        term: z.number().nullable(),
        id: z.string().nullable(),
      })
    )
    .mutation(({ ctx, input }: { ctx: any; input: any }) => {
      let sessionId = ctx?.req?.cookies["cart"] || null;

      return new Promise((resolve, reject) => {
        Cart.updateOne(
          {
            _id: mongoose.Types.ObjectId(sessionId),
            "domainSelected._id": mongoose.Types.ObjectId(input?.id),
          },
          { $set: { "domainSelected.$.term": input?.term } }
        )
          .then((result: any) => {
            resolve(result);
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }),

  updateDomainID: procedure
    .input(
      z.object({
        status: z.boolean(),
        id: z.string().nullable(),
      })
    )
    .mutation(({ ctx, input }: { ctx: any; input: any }) => {
      let sessionId = ctx?.req?.cookies["cart"] || null;

      return new Promise((resolve, reject) => {
        Cart.updateOne(
          {
            _id: mongoose.Types.ObjectId(sessionId),
            "domainSelected._id": mongoose.Types.ObjectId(input?.id),
          },
          { $set: { "domainSelected.$.domainPrivacy": input?.status } }
        )
          .then((result: any) => {
            resolve(result);
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }),

  deleteProduct: procedure
    .input(
      z
        .object({
          id: z.string().nullish(),
        })
        .nullish()
    )
    .mutation(({ ctx, input }: { ctx: any; input: any }) => {
      let sessionId = ctx?.req?.cookies["cart"] || null;

      return new Promise((resolve, reject) => {
        Cart.updateOne(
          { _id: sessionId },
          {
            preinstall: "default",
            $pull: {
              selectedPackage: {
                productId: mongoose.Types.ObjectId(input?.id),
              },
            },
            $unset: {
              product: { _id: mongoose.Types.ObjectId(input?.id) },
            },
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

  updateProductPricing: procedure
    .input(
      z.object({
        productId: z.string(),
        period: z.string().nullable(),
      })
    )
    .mutation(({ ctx, input }: { ctx: any; input: any }) => {
      let sessionId = ctx?.req?.cookies["cart"] || null;

      // // console.log(input);

      return new Promise((resolve, reject) => {
        Cart.updateOne(
          {
            _id: mongoose.Types.ObjectId(sessionId),
            "selectedPackage.productId": input?.productId,
          },
          { $set: { "selectedPackage.$.period": input.period } }
        )
          .then((result: any) => {
            resolve(result);
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }),

  checkAuth: procedure

    .input(
      z.object({
        pageName: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }: { ctx: any; input: any }) => {
      let sessionId = ctx?.req?.cookies["cart"] || null;

      let cart = await new Promise((resolve, reject) => {
        Cart.findById(sessionId)
          .then((result: any) => {
            resolve(result);
          })
          .catch((err: any) => {
            reject(err);
          });
      });

      return {
        isAuth: !_.isEmpty(ctx.session) ? true : false,
      };
    }),

  getPackages: procedure
    .input(
      z.object({
        id: z.string().nullable(),
        pageBlock: z.string().nullable(),
      })
    )
    .mutation(({ ctx, input }: { ctx: any; input: any }) => {
      let sessionId = ctx?.req?.cookies["cart"] || null;

      return new Promise((resolve, reject) => {
        Products.find({ pageBlock: input.pageBlock })
          .then((result: any) => {
            resolve({ products: JSON.parse(JSON.stringify(result)) });
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }),

  cartPackageUpdate: procedure
    .input(
      z.object({
        id: z.string(),
        period: z.string(),
      })
    )
    .mutation(async ({ ctx, input }: { ctx: any; input: any }) => {
      let sessionId = ctx?.req?.cookies["cart"] || null;

      let cartDetail: any = await new Promise((resolve, reject) => {
        Cart.findById(sessionId)
          .populate()
          .then((result: any) => {
            resolve(result);
          })
          .catch((err: any) => {
            resolve({});
          });
      });

      // console.log(cartDetail?.domainSelected);

      return new Promise((resolve, reject) => {
        Cart.updateOne(
          {
            _id: mongoose.Types.ObjectId(sessionId),
          },
          {
            $push: {
              product: input?.id,
              selectedPackage: {
                productId: input?.id,
                period: input?.period,
                domain: cartDetail?.domainSelected[0].domainName,
              },
            },
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

  updateVmCart: procedure
    .input(z.custom<CreateNodeInterface>())
    .mutation(async ({ ctx, input }: { ctx: any; input: any }) => {

      return new Promise((resolve, reject) => {
        VmCart.findOneAndUpdate(
          {
            _id: input.id,
          },
          {
            ...input,
          }
        )

          .then((result: any) => {
            resolve(result);
          })
          .catch((err) => {
            reject(err);
          });
      });
    }),
  refreshVmCart: procedure

    .input(z.custom<CreateNodeInterface>())
    .query(({ ctx, input }: { ctx: any; input: any }) => {
      return new Promise((resolve, reject) => {
        VmCart.findOne({ _id: input.id })
          .populate([{ path: "vm", populate: ["pricing"] }, { path: "region" }])
          .then((result: any) => {
            resolve(result);
          })
          .catch((err) => {
            reject(err);
          });
      });
    }),

  completeVOrder: procedure
    .input(z.custom<CreateNodeInterface>())
    .mutation(({ ctx, input }: { ctx: any; input: CreateNodeInterface }) => {
      return new Promise((resolve, reject) => {
        let id = ctx?.session?.customer[0]?._id;
        VmCart.update(
          { _id: input.id },
          {
            _id: mongoose.Types.ObjectId(),
            customer: id,
            ...input,
            sshKey: !_.isEmpty(input.sshKey) ? input.sshKey : null,
          }
        )
          .then((result) => {
            resolve({ status: true, message: "cart created", id: result._id });
          })
          .catch((err) => {
            reject(err);
          });
      });
    }),
});
