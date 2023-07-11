import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { procedure, router } from "../trpc";
import _ from "lodash";
import { Cart, mongoose } from "../../database";
// import { CartInterface } from "../../types/CartInterface";
import { serialize } from "cookie";
import { DomainExtensions } from "../../database";
const whoiser = require("whoiser");
const whois = require("whois-json");
export const t = initTRPC.create();
const domainCheck = require("domain-check");

export const searchRouter = t.router({
  query: procedure

    .input(
      z.object({
        query: z.string(),
      })
    )
    .mutation(async ({ ctx, input }: { ctx: any; input: any }) => {
      let cardSessionId = ctx?.req?.cookies["cart"] || null;

      return await new Promise(async (resolveMain, rejectMain) => {
        // checking of domain contain extension

        let domainString = splitDomain(trimDomain(input.query));

        if (!_.isEmpty(domainString)) {
          let domain = `${domainString[0]}.${domainString[1]}`;

          let available = await new Promise(async (resolve, reject) => {
            isDomainAvailable(domain).then((available) => {
              if (available) {
                resolve(available);
              } else {
                resolve(false);
              }
            });
          });

          new Promise(async (resolve, reject) => {
            let inCart = await Cart.exists(
              {
                _id: cardSessionId,
                "domainSelected.domainName": `${domainString[0]}.${domainString[1]}`,
              },
              { "domainSelected.$": 1 }
            );

            DomainExtensions.findOne({ name: domainString[1], status: true })
              .then((tld: any) => {
                let doPricing = {
                  id: tld._id,
                  domain,
                  price: tld.registerPrice,
                  renewPrice: tld.renewPrice,
                  inCart: _.isEmpty(inCart) ? false : true,
                  status: available ? "register" : "transfer",
                  promoPrice: tld.promoRegisterPrice,
                  promo: tld.promo,
                };
                resolve(doPricing);
              })
              .catch((err: any) => {
                resolve({ status: "invalid", message: "Invalid Tld" });
              });
          })
            .then(async (result: any) => {
              let featuredList = await new Promise((resolve, reject) => {
                DomainExtensions.find({
                  status: true,
                  featured: true,
                  name: { $not: new RegExp(`${domainString[1]}$`) },
                })
                  .then(async (result: any) => {
                    let listTld = await Promise.all(
                      result.map(async (item: any) => {

                        let inCart = await Cart.exists(
                          {
                            _id: cardSessionId,
                            "domainSelected.domainName": `${domainString[0]}.${item.get("name")}`,
                          },
                          { "domainSelected.$": 1 }
                        );

                        return {
                          domain: `${domainString[0]}.${item.get("name")}`,
                          _id: item._id,
                          inCart: _.isEmpty(inCart) ? false : true,
                        };
                      })
                    );
                    resolve(listTld);
                  })
                  .catch((err: any) => {
                    resolve([]);
                  });
              });

              resolveMain({
                ...result,
                query: domainString[0],
                ext: domainString[1],
                featuredList,
              });
            })
            .catch((err: any) => {
              rejectMain(err);
            });
        } else {
          rejectMain(new Error("Invalid search query"));
        }
      });
    }),

  subquery: procedure

    .input(
      z.object({
        query: z.string(),
      })
    )
    .mutation(({ input }) => {
      return new Promise(async (mainResolve, mainReject) => {
        let domainString = splitDomain(trimDomain(input.query));

        if (!_.isEmpty(domainString)) {
          let domain = `${domainString[0]}.${domainString[1]}`;

          let available: any = await new Promise((resolve, reject) => {
            isDomainAvailable(domain).then(async (available) => {
              if (available) {
                resolve({ status: available });
              } else {
                resolve({ status: false });
              }
            });
          });

          new Promise(async (resolve, reject) => {
            DomainExtensions.findOne({ name: domainString[1], status: true })
              .then((tld: any) => {
                let doPricing = {
                  id: tld._id,
                  domain,
                  price: tld.registerPrice,
                  renewPrice: tld.renewPrice,
                  status: available?.status ? "register" : "taken",
                  promoPrice: tld.promoRegisterPrice,
                  promo: tld.promo,
                };
                resolve(doPricing);
              })
              .catch((err: any) => {
                resolve({});
              });
          })
            .then(async (result: any) => {
              let featuredList = await new Promise((resolve, reject) => {
                DomainExtensions.find({
                  status: true,
                  featured: true,
                  name: { $not: new RegExp(`${domainString[1]}$`) },
                })
                  .then((result: any) => {
                    let listTld = result.map((item: any) => {
                      return {
                        domain: `${domainString[0]}.${item.name}`,
                        _id: item._id,
                      };
                    });
                    resolve(listTld);
                  })
                  .catch((err: any) => {
                    resolve([]);
                  });
              });

              mainResolve({ ...result });
            })
            .catch((err: any) => {
              mainReject(err);
            });
        } else {
          mainResolve({});
        }
      });
    }),

  addToCart: procedure

    .input(
      z.object({
        name: z.string(),
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }: { ctx: any; input: any }) => {
      let sessionId = ctx?.req?.cookies["cart"] || null;



      return new Promise(async (resolve, reject) => {

        let doCart = await Cart.findById(sessionId);

        if (_.isEmpty(sessionId) || _.isEmpty(doCart)) {
          let tld: any = await new Promise((resolve, reject) => {
            DomainExtensions.findOne({ _id: input?.id })
              .then((result: any) => {
                resolve(result);
              })
              .catch((err: any) => {
                resolve({});
              });
          });

          Cart.create({
            _id: mongoose.Types.ObjectId(),
            tldExt: input?.id,
            domainSelected: {
              domainName: input?.name,
              tldId: input?.id,
              registerPrice: tld?.registerPrice,
              promo: tld?.promo,
              domainPrivacy:false,
              renewPrice: tld?.renewPrice,
              maxPeriod: tld?.MaxRegistrationPeriod,
              promoRegisterPrice: tld?.promoRegisterPrice,
              term: 1,
            },
          })
            .then((result: any) => {
              ctx?.res.setHeader(
                "Set-Cookie",
                serialize("cart", result._id, {
                  path: "/",
                  maxAge: 1000 * 60 * 60 * 24 * 30,
                  httpOnly: true,
                })
              );
              resolve(result);
            })
            .catch((err: any) => {
              reject(err);
            });
        } else {
          /// updating selected

          let tld: any = await new Promise((resolve, reject) => {
            DomainExtensions.findOne({ _id: input?.id })
              .then((result: any) => {
                resolve(result);
              })
              .catch((err: any) => {
                resolve({});
              });
          });

          Cart.updateOne(
            {
              _id: sessionId,
            },
            {
              $addToSet: {
                tldExt: input?.id,
                domainSelected: {
                  domainName: input?.name,
                  tldId: input?.id,
                  registerPrice: tld?.registerPrice,
                  promo: tld?.promo,
                  domainPrivacy:false,
                  renewPrice: tld?.renewPrice,
                  maxPeriod: tld?.MaxRegistrationPeriod,
                  promoRegisterPrice: tld?.promoRegisterPrice,
                  term: 1,
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
        }
      });
    }),

  featuredList: procedure
    .input(
      z
        .object({
          name: z.string().nullish(),
          ext: z.string().nullish(),
        })
        .nullish()
    )
    .query(({ ctx, input }: { ctx: any; input: any }) => {
      let sessionId = ctx?.req?.cookies["cart"] || null;

      return new Promise((resolve, reject) => {
        if (_.isEmpty(input?.name)) {
          resolve([]);
        } else
          DomainExtensions.find({
            status: true,
            featured: true,
            name: { $not: new RegExp(`${input?.ext}$`) },
          })
            .then(async (result: any) => {
              let listTld = await Promise.all(
                result.map(async (item: any) => {
                  let inCart = await Cart.exists(
                    {
                      _id: sessionId,
                      "domainSelected.domainName": `${input?.name}.${item.name}`,
                    },
                    { "domainSelected.$": 1 }
                  );

                  return {
                    domain: `${input?.name}.${item.name}`,
                    _id: item._id,
                    inCart: _.isEmpty(inCart) ? false : true,
                  };
                })
              );
              resolve(listTld);
            })
            .catch((err: any) => {
              resolve([]);
            });
      });
    }),
});

function splitDomain(
  domain: string,
  defaultExtension = "com"
): [string, string] {
  const parts = domain.split(".");
  if (parts.length === 1) {
    // domain doesn't have an extension, add default extension
    return [parts[0], defaultExtension];
  }
  const extension: any = parts.pop();
  const name = parts.join(".");
  return [name, extension];
}

function trimDomain(domain: string): string {
  return domain.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "");
}

function extractDomainExtension(domainName: string): string | null {
  const regex = /\.([a-z]+)$/i;
  const match = domainName.match(regex);
  return match ? match[1] : null;
}

async function isDomainAvailable(domain: string) {
  const Domain = domainCheck.Domain;
  const domainD = new Domain(domain);

  return new Promise(async (resolve, reject) => {
    domainD
      .isFree()
      .then((result: any) => {
        resolve(result);
      })
      .catch((err: any) => {
        // console.log(err);

        resolve(false);
      });
  });
}
