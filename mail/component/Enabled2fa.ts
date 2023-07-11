import { Messager } from "../Messager";
import { Transporter } from "../Transporter";
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';


const Enabled2fa = async (customer?: any) => {


    const source = fs.readFileSync('./mail/templates/email-2FA-enabled.html', 'utf-8').toString();
    const template = handlebars.compile(source);

    const htmlToSend = template({
        APP_DOMAIN: process.env.APP_DOMAIN
    });

    Messager({
        to: `${customer.email}`,
        subject: "Two-factor authentication is enabled",
        text: "",
        html: htmlToSend
    }).catch((err) => {
        // console.log(err);
    })

}

export {Enabled2fa}