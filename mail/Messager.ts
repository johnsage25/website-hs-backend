import { Transporter } from "./Transporter";

const nodemailer = require("nodemailer");

const Messager = async ({from = process.env.MAIL_FROM, to, subject, text, html, attachments}: {from?:string, to?: string, subject?: string, text?: string, html?: string, attachments?:any[]}) => {

    let info = await Transporter.sendMail({
        from: `${from} <${from}>`,
        to: to,
        subject: subject,
        text: text,
        html: html,
        attachments:attachments
    });

    return info

}

export {Messager}