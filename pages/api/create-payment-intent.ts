import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import pdf from "html-pdf";
import handlebars from "handlebars";
import fs from "fs";
import dateFormat, { masks } from "dateformat";
import { Invoices } from "../../database";
import { InvoiceInterface, Order } from "../../Types/InvoiceInterface";
import { Ucword } from "../../Components/TextFormatter";
import {
  GetPeriodInString,
  GetProductPrice,
  PackageTerms,
  currencyConverter,
} from "../../utils/helpers";
// import { GeneratePdfEmail } from "../../mail/component/generatePdfEmail";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method === "POST") {
//     const { items } = req.body;

//     let invoice: InvoiceInterface = await new Promise((resolve, reject) => {
//       Invoices.findOne({ _id: "640d0bc34d161e3362a623b3" })
//         .populate([
//           { path: "domainorders", populate: { path: "extension" } },
//           { path: "orders", populate: { path: "Products" } },
//           { path: "sslorders", populate: { path: "ssl" } },
//           { path: "customer", populate: "BillingAddress" },
//         ])
//         .then((result) => {
//           // console.log(result?.invoiceNumber);

//           resolve(result);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });

//     await GeneratePdfEmail(invoice);

//     res.status(200).json({ invoice });
//   } else {
//     res.status(400).json({ message: "Invalid method" });
//   }
// }
