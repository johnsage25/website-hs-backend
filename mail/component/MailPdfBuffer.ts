import { Messager } from "../Messager";
import { Transporter } from "../Transporter";
import * as handlebars from "handlebars";
import * as fs from "fs";
import * as path from "path";
import { Invoices } from "../../database";
const nodemailer = require("nodemailer");
const pdf = require("html-pdf");
import dateFormat, { masks } from "dateformat";
import { Ucword } from "../../Components/TextFormatter";
import { currencyConverter } from "../../utils/helpers";
import _ from "lodash";
const lookup = require("country-code-lookup");

const MailPdfBuffer = async (customer?: any, invoice?: any) => {
  // Generate a PDF from an HTML template

  let htmlTemplate, html


  let firstname = invoice.customer?.firstname;
  let lastname = invoice.customer?.lastname;
  let address = invoice.customer?.BillingAddress[0]?.address;
  let country =
    lookup.byInternet(invoice.customer.BillingAddress[0]?.country)?.country ||
    invoice.customer.BillingAddress[0]?.country;

  if (_.isEqual(invoice?.type, "vm")) {
    htmlTemplate = fs.readFileSync("./Pdf/invoice-vm-created.html", "utf-8");
    const template = handlebars.compile(htmlTemplate);

    html = template({
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
            start: dateFormat(item?.start, "m/d/yy HH:MM"),
            end: dateFormat(item?.end, "m/d/yy HH:MM"),
            total_amount: currencyConverter(item.total_amount),
          };
        }),
      });


  } else {
    htmlTemplate = fs.readFileSync("./Pdf/invoice-created.html", "utf-8");
    const template = handlebars.compile(htmlTemplate);

    html = template({
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
            total_amount: currencyConverter(item.total_amount),
          };
        }),
      });

  }

  return new Promise((resolve, reject) => {
    pdf.create(html).toBuffer((err, buffer) => {
      if (err) {
        reject(null);
        return;
      }

      resolve(buffer);
    });
  });
};

export { MailPdfBuffer };
