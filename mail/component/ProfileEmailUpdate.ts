import { Messager } from "../Messager";
import { Transporter } from "../Transporter";
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';


const ProfileEmailUpdate = async (email?: string, oldEmail?:string, activationLink?: string) => {


    const source = fs.readFileSync('./mail/templates/email-update.html', 'utf-8').toString();
    const template = handlebars.compile(source);

    const htmlToSend = template({
        email,
        activationLink
    });

    Messager({
        to: `${email}, ${oldEmail}`,
        subject: "Email Activation",
        text: "",
        html: htmlToSend
    }).catch((err) => {
        // console.log(err);
    })

}

export {ProfileEmailUpdate}