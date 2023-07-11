import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { procedure, router } from "../trpc";
import _ from "lodash";
import { CreateNodeInterface } from "../../Types/CreateNodeInterface";
import { Orders, VmCart, mongoose } from "../../database";
import { PaginationInterface } from "../../Types/PaginationInterface";
import { NodeActionInterface } from "../../Types/NodeActionInterface";
import { vmShutdown } from "../../nodeProxmox/shutdown";
import { vmTurnOn } from "../../nodeProxmox/vmTurnOn";
import { vmStatus } from "../../nodeProxmox/vmStatus";
import { vmReboot } from "../../nodeProxmox/vmReboot";
import { vmPassword } from "../../nodeProxmox/vmPassword";
import { vmChangeHostname } from "../../nodeProxmox/vmChangeHostname";
import { vmFirewallProps } from "../../nodeProxmox/vmFirewallProps";
import { FirewallInterface } from "../../Types/FirewallInterface";
import { vmFirewallUpdate } from "../../nodeProxmox/vmFirewallUpdate";
import { vmFirewallDelete } from "../../nodeProxmox/vmFirewallDelete";
import { vmFirewallAdd } from "../../nodeProxmox/vmFirewallAdd";
import { vmTerminal } from "../../nodeProxmox/vmTerminal";
import { CpuGraph } from "../../nodeProxmox/CpuGraph";
import statusCheck from "../../nodeMyloc/statusCheck";
import { ProductVmInterface } from "../../Types/ProductVmInterface";
import vmRebootMyloc from "../../nodeMyloc/vmRebootMyloc";
import vncMylocVM from "../../nodeMyloc/vncMylocVM";

export const t = initTRPC.create();

const OrderProps = async (orderId: any) => {
  return await Orders.findOne({ _id: orderId }).populate([
    { path: "node" },
    { path: "region" },
    { path: "customer" },
    { path: "connection" },
    { path: "sshKey" },
  ]);
};

export const nodeRouter = t.router({
  create: procedure
    .input(z.custom<CreateNodeInterface>())
    .mutation(({ ctx, input }: { ctx: any; input: CreateNodeInterface }) => {
      return new Promise((resolve, reject) => {
        let id = ctx?.session?.customer[0]?._id;
        VmCart.create({
          _id: mongoose.Types.ObjectId(),
          customer: id,
          metaData: {
            ...input,
            sshKey: !_.isEmpty(input.sshKey) ? input.sshKey : null,
          },
        })
          .then((result) => {
            resolve({ status: true, message: "cart created", id: result._id });
          })
          .catch((err) => {
            reject(err);
          });
      });
    }),

  list: procedure
    .input(z.custom<PaginationInterface>())
    .query(({ ctx, input }: { ctx: any; input: PaginationInterface }) => {
      let id = ctx?.session?.customer[0]?._id;
      return new Promise((resolve, reject) => {
        Orders.paginate({ customer: [id], productType: "vm" }, { ...input })
          .then((result: any) => {
            // // console.log(result);

            resolve(result);
          })
          .catch((err: any) => {
            resolve({});
          });
      });
    }),
  vmDetail: procedure
    .input(
      z.object({
        orderId: z.string(),
      })
    )
    .query(async ({ ctx, input }: { ctx: any; input: any }) => {
      return new Promise((resolve, reject) => {
        OrderProps(input.orderId)
          .then(async (result: any) => {
            switch (result.connection.panel) {
              case "proxmox":
                vmStatus(result.vmid, result.region[0].locationId)
                  .then((result: any) => {
                    resolve(result);
                  })
                  .catch((err) => {
                    reject(err);
                  });

                break;
              case "myloc":
                statusCheck(result.connection, result.vmid)
                  .then((resultd: any) => {
                    resolve(resultd);
                  })
                  .catch((err: any) => {
                    reject(err);
                  });
                break;
              default:
                break;
            }
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    }),
  serverAction: procedure
    .input(z.custom<NodeActionInterface>())
    .mutation(
      async ({ ctx, input }: { ctx: any; input: NodeActionInterface }) => {
        const { action, orderId } = input;

        /// get order

        let order: ProductVmInterface = await OrderProps(input.orderId);

        return new Promise((resolve, reject) => {
          switch (action) {
            case "shutdown":
              switch (order.connection.panel) {
                case "proxmox":
                  vmShutdown(order.vmid, order.region[0].locationId)
                    .then(async (result: any) => {
                      resolve(result.data);
                    })
                    .catch((err) => {
                      reject(err);
                    });

                  break;

                case "myloc":

                default:
                  break;
              }

              break;
            case "turnon":
              vmTurnOn(order.vmid, order.region[0].locationId)
                .then(async (result: any) => {
                  resolve(result.data);
                })
                .catch((err) => {
                  console.log(err);

                  reject(err);
                });
              break;
            case "reboot":
              // start
              switch (order.connection.panel) {
                case "proxmox":
                  vmReboot(order.vmid, order.region[0].locationId)
                    .then(async (result: any) => {
                      resolve(result.data);
                    })
                    .catch((err) => {
                      console.log(err);

                      reject(err);
                    });
                  break;
                case "myloc":
                  vmRebootMyloc(order.connection, order.vmid)
                    .then((result: any) => {
                      resolve(result.data);
                    })
                    .catch((err: any) => {
                      reject(err);
                    });

                  break;
                default:
                  break;
              }

            default:
              break;
          }
        });
      }
    ),

  vmPassword: procedure
    .input(
      z.object({
        password: z.string(),
        orderId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }: { ctx: any; input: any }) => {
      return new Promise(async (resolve, reject) => {
        let order = await OrderProps(input.orderId);

        switch (order.vmProvider) {
          case "proxmox":
            vmPassword(
              order.vmid,
              order.region[0].locationId,
              "root",
              input.password
            )
              .then(async (result: any) => {
                // await Orders.updateOne(
                //   { _id: input.orderId },
                //   {
                //     password: input.password,
                //   }
                // );

                resolve(result);
              })
              .catch((err: any) => {
                console.log(err);

                reject(err);
              });
            break;
          default:
            break;
        }
      });
    }),

  changeHostname: procedure

    .input(
      z.object({
        host: z.string(),
        orderId: z.string(),
      })
    )
    .mutation(({ ctx, input }: { ctx: any; input: any }) => {
      return new Promise(async (resolve, reject) => {
        let order = await OrderProps(input.orderId);

        switch (order.vmProvider) {
          case "proxmox":
            vmChangeHostname(order.vmid, order.region[0].locationId, input.host)
              .then((result: any) => {
                Orders.updateOne(
                  { _id: input.orderId },
                  { hostname: input.host }
                )
                  .then((result: any) => {
                    resolve(result);
                  })
                  .catch((err: any) => {
                    reject(err);
                  });
              })
              .catch((err: any) => {
                reject(err);
              });

            break;

          default:
            break;
        }
        // console.log(order);
      });
    }),

  firewareRules: procedure
    .input(
      z
        .object({
          orderId: z.string().nullish(),
        })
        .nullish()
    )
    .query(({ ctx, input }: { ctx: any; input: any }) => {
      return new Promise(async (resolve, reject) => {
        let order = await OrderProps(input.orderId);

        switch (order.vmProvider) {
          case "proxmox":
            vmFirewallProps(order.vmid, order.region[0].locationId)
              .then((result: any) => {
                resolve(result);
              })
              .catch((err) => {
                reject(err);
              });

            break;

          default:
            break;
        }
      });
    }),

  addFirewall: procedure
    .input(z.custom<FirewallInterface>())
    .mutation(({ ctx, input }: { ctx: any; input: any }) => {
      return new Promise(async (resolve, reject) => {
        let order = await OrderProps(input.orderId);

        delete input.orderId;

        switch (order.vmProvider) {
          case "proxmox":
            vmFirewallAdd(order?.vmid, order.region[0]?.locationId, input)
              .then((result: any) => {
                resolve(result);
              })
              .catch((err: any) => {
                console.log(err);

                reject(err);
              });
            break;

          default:
            break;
        }
      });
    }),

  updateFirewall: procedure
    .input(z.custom<FirewallInterface>())
    .mutation(({ ctx, input }: { ctx: any; input: any }) => {
      return new Promise(async (resolve, reject) => {
        let order = await OrderProps(input.orderId);

        delete input.orderId;

        switch (order.connection.panel) {
          case "proxmox":
            vmFirewallUpdate(order?.vmid, order.region[0]?.locationId, input)
              .then((result: any) => {
                resolve(result);
              })
              .catch((err: any) => {
                console.log(err);

                reject(err);
              });
            break;

          default:
            break;
        }
      });
    }),

  deleteFirewallRule: procedure
    .input(z.custom<FirewallInterface>())
    .mutation(async ({ ctx, input }: { ctx: any; input: any }) => {
      let order = await OrderProps(input.orderId);

      return new Promise((resolve, reject) => {
        switch (order.connection.panel) {
          case "proxmox":
            vmFirewallDelete(order?.vmid, order.region[0]?.locationId, input)
              .then((result: any) => {
                resolve(result);
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

  cpuUsage: procedure
    .input(
      z.object({
        orderId: z.string(),
        timeframe: z.string(),
      })
    )
    .query(async ({ ctx, input }: { ctx: any; input: any }) => {
      return new Promise(async (resolve, reject) => {
        let order = await OrderProps(input.orderId);
        switch (order.connection.panel) {
          case "proxmox":
            CpuGraph(order?.vmid, order.region[0]?.locationId, input.timeframe)
              .then((result: any) => {
                console.log(result);
                resolve(result);
              })
              .catch((err: any) => {
                console.log(err);
                resolve(err);
              });

            break;

          default:
            break;
        }
      });
    }),

  terminal: procedure
    .input(
      z.object({
        orderId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }: { ctx: any; input: any }) => {
      return new Promise(async (resolve, reject) => {
        let order = await OrderProps(input.orderId);
        switch (order.connection.panel) {
          case "proxmox":
            vmTerminal(order?.vmid, order.region[0]?.locationId)
              .then((result: any) => {
                console.log(result);
                resolve(result);
              })
              .catch((err: any) => {
                console.log(err);
                resolve(err);
              });
            console.log(order);
            break;
          case "myloc":
            vncMylocVM(order.connection, order.vmid)
              .then((result: any) => {
                console.log(result.data);

                resolve(result.data);
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
});
