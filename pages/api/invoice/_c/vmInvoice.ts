import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import pdf from "html-pdf";
import handlebars from "handlebars";
import fs from "fs";
const lookup = require("country-code-lookup");
import dateFormat, { masks } from "dateformat";
import { currencyConverter } from "../../../../utils/helpers";
import { Ucword } from "../../../../Components/TextFormatter";
import { Invoices } from "../../../../database";

const VmInvoice  =  async (
  req: NextApiRequest & { user: any },
  res: NextApiResponse
) => {
  const htmlTemplate = fs.readFileSync("./Pdf/invoice-vm-created.html", "utf-8");

  const { id, type } = req.body;

  // generate PDF from HTML template with parameters
  const template = handlebars.compile(htmlTemplate);

  let invoice: any = await new Promise((resolve, reject) => {
    Invoices.findById(id)
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

  let firstname = invoice.customer?.firstname;
  let lastname = invoice.customer?.lastname;
  let address = invoice.customer?.BillingAddress[0]?.address;
  let country =
    lookup.byInternet(invoice.customer.BillingAddress[0]?.country)?.country ||
    invoice.customer.BillingAddress[0]?.country;

  const html = template({
    APP_DOMAIN: process.env.APP_DOMAIN,
    invoiceNo: invoice.invoiceNumber,
    createDate: dateFormat(invoice?.createdAt, "mmmm dS, yyyy"),
    paymentMethod: Ucword(invoice.paymentMethod),
    fullname: Ucword(`${firstname} ${lastname}`),
    address: `${address}`,
    country: `${country}`,
    total: currencyConverter(invoice.total),
    subTotal: currencyConverter(invoice.subTotal),
    tax: currencyConverter(invoice.taxed),
    items: invoice.items?.map((item: any) => {

      return {
        ...item,
        amount: currencyConverter(item.amount),
        start:  dateFormat(item?.start, "m/d/yy HH:MM"),
        end:  dateFormat(item?.end, "m/d/yy HH:MM"),
        total_amount: currencyConverter(item.total_amount),
      };
    }),
  });

  const options = { format: "A4" };
  pdf.create(html, options).toBuffer(async (err, buffer) => {
    if (err) throw err;

    // create nodemailer transport

    // Set the content type and content disposition headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="invoice.pdf"');

    // Send the PDF buffer as the response
    res.send(buffer);

    // End the response
    res.end();
  });
};

export default VmInvoice;
