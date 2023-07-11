import { Customers, Orders } from "../database";

export const OrderDetails = async (context: any) => {
  return await new Promise((resolve, reject) => {
    const { id } = context.params;

    Orders.findOne({ _id: id })
      .populate([
        { path: "Products", populate: ["connectionOption"] },
        { path: "customer"},
        { path: "invoice" },
        { path: "extension" },
        { path: "whois" },
        { path: "nslist" },
        { path: "hostMeta" },
      ])
      .then((result: any) => {
        // // console.log(result);

        resolve(JSON.parse(JSON.stringify(result)));
      })
      .catch((err: any) => {
        resolve({});
      });
  });
};
