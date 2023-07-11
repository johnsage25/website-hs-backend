import { Customers, Orders } from "../database";

export const GetVmOrders = async (context: any, id: string) => {
  return await new Promise((resolve, reject) => {
    Orders.find({ customer: [id], productType: "vm" })

      .sort({ createdAt: -1 })
      .populate([
        { path: "node"},
        { path: "region" },
        { path: "customer" },
        { path: "sshKey" },
      ]).limit(25)
      .then((result: any) => {
        // // console.log(result);

        resolve(JSON.parse(JSON.stringify(result)));
      })
      .catch((err: any) => {
        resolve({});
      });
  });
};
