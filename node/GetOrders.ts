import { Customers, Orders } from "../database";

export const GetOrders = async (context: any, id: string) => {
  return await new Promise((resolve, reject) => {

    Orders.find({customer: [id], productType: "hosting"}).sort({createdAt: -1})
      .populate([
        { path: "Products", populate: ["connectionOption"] },
        { path: "customer"},
        { path: "invoice" },
        { path: "extension" },
        { path: "whois" },
        { path: "nslist" },
        { path: "hostMeta" },
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
