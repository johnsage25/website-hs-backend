import { Messager } from "../Messager";
import { Transporter } from "../Transporter";
import * as handlebars from "handlebars";
import * as fs from "fs";
import * as path from "path";
import { CustomerType } from "../../Types/CustomerType";
import { Invoices } from "../../database";
import dateFormat, { masks } from "dateformat";
import { currencyConverter } from "../../utils/helpers";
import { MailPdfBuffer } from "./MailPdfBuffer";


const PaymentReceipt = async (
  customer?: CustomerType,
  invoiceId?: string,
  title?: string
) => {
  const source = fs
    .readFileSync("./mail/templates/paymentReceipt.html", "utf-8")
    .toString();
  const template = handlebars.compile(source);

  let invoice: any = await new Promise((resolve, reject) => {
    Invoices.findById(invoiceId)
      .populate([
        { path: "items" },
        { path: "customer", populate: "BillingAddress" },
      ])
      .lean()
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });

  const htmlToSend = template({
    APP_DOMAIN: process.env.APP_DOMAIN,
    MAIL_SUPPORT_URL: process.env.MAIL_SUPPORT_URL,
    ACTION_URL:`${process.env.APP_DOMAIN}/billing/invoice?id=${invoiceId}`,
    invoiceNo: invoice?.invoiceNumber,
    name: `${customer?.firstname}`,
    date: dateFormat(invoice.createdAt, "fullDate"),
    subTotal: currencyConverter(invoice.subTotal),
    total: currencyConverter(invoice.total),
    title,
    items: invoice.items.map((item: any) => {
      return {
        ...item,
        amount: currencyConverter(item.amount),
      };
    }),
  });

  Messager({
    from: process.env.MAIL_FROM_BILLING,
    to: `${customer?.email}`,
    subject: `HostSpacing: Payment Receipt`,
    text: "",
    html: htmlToSend,
    attachments: [
      {
        filename: "invoice.pdf",
        content: await MailPdfBuffer(customer, invoice),
      },
    ],
  }).catch((err) => {
    // console.log(err);
  });
};

export { PaymentReceipt };
