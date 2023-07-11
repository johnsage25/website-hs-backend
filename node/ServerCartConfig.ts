import { Customers, Orders, VmCart } from "../database";

export const ServerCartConfig = async (context: any) => {
  const { id } = context.query;
  console.log(context.query);

  return await new Promise((resolve, reject) => {
    VmCart.findById(id)
      .populate([{ path: "vm", populate: ["pricing"] }, { path: "region"}])
      .then((result: any) => {

        resolve(JSON.parse(JSON.stringify(result)));
      })
      .catch((err: any) => {
        resolve({});
      });
  });
};
