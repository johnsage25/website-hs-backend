import { Messager } from "../Messager";
import { Transporter } from "../Transporter";
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';


const DomainTransferEmail = async (customer?:any, domain?: string, code?: string) => {


    const source = fs.readFileSync('./mail/templates/domain-transfer.html', 'utf-8').toString();
    const template = handlebars.compile(source);

    const htmlToSend = template({
        APP_DOMAIN: process.env.APP_DOMAIN,
        domain:domain,
        code:code
    });

    Messager({
        to: `${customer.email}`,
        subject: "Your transfer code",
        text: "",
        html: htmlToSend
    }).catch((err) => {
        // console.log(err);
    })

}

export {DomainTransferEmail}