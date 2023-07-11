import { initTRPC } from "@trpc/server";
import { z } from "zod";
import {
  BillingAddress,
  ChildNameServer,
  Customers,
  Orders,
  ServerConnections,
  WhoisRecords,
  mongoose,
} from "../../database";
import { BillingType } from "../../Types/CustomerType";
import { SignUpBillingInterface } from "../../Types/SignUpBillingInterface";
import { procedure, router } from "../trpc";
import _ from "lodash";
import { PaginationInterface } from "../../Types/PaginationInterface";
import { PanelServerPropsInterface } from "../../Types/PanelServerPropsInterface";
import pleskUserChart from "./utils/pleskUserChart";
import { WhoisFormInterface } from "../../Types/WhoisFormInterface";
import { DomainWhoisUpdateDomainAPI } from "../../node/DomainWhoisUpdateDomainAPI";
import { DomainNameAPINameUpdate } from "../../node/DomainNameAPINameUpdate";
import { DomainNameAPIAddChildNS } from "../../node/DomainNameAPIAddChildNS";
import { DomainAPIRemoveChildNS } from "../../node/DomainAPIRemoveChildNS";
import { DomainNameAPIUpdateChildNS } from "../../node/DomainNameAPIUpdateChildNS";
import { ChildNameServerDataInterface2 } from "../../Types/ChildNameServerDataInterface2";
import { TheftProtectionLock } from "../../node/EnableTheftProtectionLock";
import { DomainPrivacyIDUpdate } from "../../node/DomainPrivacyIDUpdate";
import { DomainGetCode } from "../../node/DomainGetCode";
import { DomainTransferEmail } from "../../mail/component/DomainTransferEmail";
var generator = require("generate-password");

export const t = initTRPC.create();
export const domainManagerRouter = router({
  updateWhois: procedure
    .input(z.custom<WhoisFormInterface>())
    .mutation(
      async ({ ctx, input }: { ctx: any; input: WhoisFormInterface }) => {
        return new Promise(async (resolve, reject) => {
          let order = await Orders.findById(input.orderId);

          WhoisRecords.createOrUpdate(
            {
              order: order.id,
            },
            {
              ...input,
              order: order.id,
            }
          )
            .then(async (result: any) => {
              switch (order.domainRegistrar) {
                case "domainnameapi":
                  let callback = await new Promise((resolve, reject) => {
                    DomainWhoisUpdateDomainAPI(input, order.domain)
                      .then((callback: any) => {
                        if (callback.result == "OK") {
                          resolve(callback);
                        } else {
                          reject(new Error(callback.error));
                        }
                      })
                      .catch((err: any) => {});
                  });

                  resolve(callback);

                  break;

                default:
                  resolve({});
              }
            })
            .catch((err: any) => {
              reject(err);
            });
        });
      }
    ),
  dnsUpdate: procedure
    .input(
      z.object({
        dnsList: z.any(),
        orderId: z.string(),
        domainame: z.string(),
      })
    )
    .mutation(({ input }) => {
      // nameServerList
      return new Promise(async (resolve, reject) => {
        let order = await Orders.findById(input.orderId);

        switch (order.domainRegistrar) {
          case "domainnameapi":
            DomainNameAPINameUpdate(input.dnsList, order.domain)
              .then((callback: any) => {
                if (callback.result == "OK") {
                  Orders.updateOne(
                    { _id: input?.orderId },
                    {
                      $set: {
                        nameServerList: input.dnsList,
                      },
                    }
                  )
                    .then(async (result: any) => {
                      resolve(callback);
                    })
                    .catch((err: any) => {
                      reject(err);
                    });
                } else {
                  reject(new Error(callback.error));
                }
              })
              .catch((err: any) => {
                reject(err);
              });
            break;

          default:
            break;
        }
      });
    }),

  addChildNS: procedure
    .input(z.custom<ChildNameServerDataInterface2>())
    .mutation(({ input }) => {
      return new Promise(async (resolve, reject) => {
        DomainNameAPIAddChildNS(input)
          .then((callback: any) => {
            if (callback.result == "OK") {
              ChildNameServer.create({
                _id: mongoose.Types.ObjectId(),
                ...input,
              })
                .then(async (result: any) => {
                  resolve(callback);
                })
                .catch((err: any) => {
                  reject(err);
                });
            } else {
              reject(new Error("NS already added"));
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    }),

  updateChildNS: procedure
    .input(z.custom<ChildNameServerDataInterface2>())
    .mutation(({ input }) => {
      return new Promise(async (resolve, reject) => {
        DomainNameAPIUpdateChildNS(input)
          .then((callback: any) => {
            if (callback.result == "OK") {
              ChildNameServer.updateOne(
                {
                  _id: input._id,
                },
                { ...input }
              )
                .then(async (result: any) => {
                  resolve(callback);
                })
                .catch((err: any) => {
                  reject(err);
                });
            } else {
              reject(new Error("NS already added"));
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    }),

  removeChildNS: procedure
    .input(z.custom<ChildNameServerDataInterface2>())
    .mutation(({ input }) => {
      return new Promise((resolve, reject) => {
        DomainAPIRemoveChildNS(input)
          .then((callback: any) => {
            // console.log(callback);
            if (callback.result == "OK") {
              ChildNameServer.deleteOne({
                _id: input._id,
              })
                .then(async (result: any) => {
                  resolve(callback);
                })
                .catch((err: any) => {
                  reject(err);
                });
            }
          })
          .catch((err) => {});
      });
    }),

  transferLock: procedure
    .input(
      z.object({
        domain: z.string(),
        orderId: z.string(),
        status: z.boolean(),
      })
    )
    .mutation(({ input }) => {
      return new Promise(async (resolve, reject) => {
        let order = await Orders.findById(input.orderId);

        switch (order.domainRegistrar) {
          case "domainnameapi":
            TheftProtectionLock(input.domain, input.status)
              .then((callback: any) => {
                Orders.updateOne(
                  { _id: input.orderId },
                  {
                    domainTransferLock: input.status,
                  }
                )
                  .then((result: any) => {
                    resolve(callback);
                  })
                  .catch((err: any) => {
                    reject(err);
                  });
              })
              .catch((err: any) => {
                // console.log(err);
              });

            break;

          default:
            break;
        }
      });
    }),
  updateDomainID: procedure
    .input(
      z.object({
        orderId: z.string(),
        domain: z.string(),
        status: z.boolean(),
      })
    )
    .mutation(({ input }) => {
      return new Promise(async (resolve, reject) => {
        let order = await Orders.findById(input.orderId);

        switch (order.domainRegistrar) {
          case "domainnameapi":
            DomainPrivacyIDUpdate(input.domain, input.status)
              .then((callback: any) => {
                Orders.updateOne(
                  { _id: input.orderId },
                  {
                    domainPrivacy: input.status,
                  }
                )
                  .then((result: any) => {
                    resolve(callback);
                  })
                  .catch((err: any) => {
                    reject(err);
                  });
              })
              .catch((err: any) => {
                // console.log(err);
              });

            break;

          default:
            break;
        }
      });
    }),

  domainTransfer: procedure
    .input(
      z.object({
        orderId: z.string(),
      })
    )
    .mutation(({ input }) => {
      return new Promise(async (resolve, reject) => {
        let order: any = await Orders.findById(input.orderId).populate([
          { path: "customer" },
        ]);

        var code = generator.generate({
          length: 10,
          numbers: true,
        });

        let customer = order?.customer[0];

        switch (order.domainRegistrar) {
          case "domainnameapi":
            DomainGetCode(order.domain, code)
              .then((callback: any) => {
                DomainTransferEmail(customer, order?.domain, callback.data.AuthCode);
                resolve({status: true});
              })
              .catch((err: any) => {
                // console.log(err);
              });

            break;

          default:
            break;
        }
      });
    }),
});
