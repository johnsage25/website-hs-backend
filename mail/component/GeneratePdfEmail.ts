import { Messager } from "../Messager";
import { Transporter } from "../Transporter";
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { CustomerType } from "../../Types/CustomerType";

const InvoiceCreated = async (customer?: CustomerType, invoiceNo?: string, title?:string) => {


    // console.log(customer);

    const source = fs.readFileSync('./mail/templates/paymentReceipt.html', 'utf-8').toString();
    const template = handlebars.compile(source);

    const htmlToSend = template({
        APP_DOMAIN: process.env.APP_DOMAIN,
        invoiceNo: invoiceNo,
        fullname: `${customer?.firstname} ${customer?.lastname}`,
        title,
    });

    Messager({
        to: `${customer?.email}`,
        subject: title,
        text: "",
        html: htmlToSend
    }).catch((err) => {
        // console.log(err);
    })

}

export {InvoiceCreated}