import { Customers, Orders } from "../database";

export const GetDomainOrders = async (context: any, id: string) => {
  return await new Promise((resolve, reject) => {
    Orders.find({ customer: [id], orderType: "Domain Names" })
      .sort({ createdAt: -1 })
      .populate([
        { path: "customer" },
        { path: "invoice" },
        { path: "extension" },
        { path: "whois" },
        { path: "nslist" },
      ])
      .limit(15)
      .then((result: any) => {
        // // console.log(result);

        resolve(JSON.parse(JSON.stringify(result)));
      })
      .catch((err: any) => {
        resolve({});
      });
  });
};
