import { NextApiRequest, NextApiResponse } from "next";
import passport from "../../../lib/passport-google-auth";
import nextConnect from "next-connect";
import { Invoices } from "../../../database";
import pdf from "html-pdf";
import handlebars from "handlebars";
import fs from "fs";
const lookup = require("country-code-lookup");
import dateFormat, { masks } from "dateformat";
import { Ucword } from "../../../Components/TextFormatter";
import { currencyConverter } from "../../../utils/helpers";
import General from "./_c/general";
import _ from "lodash";
import VmInvoice from "./_c/vmInvoice";

var session = require("express-session");

export default nextConnect().post(
  async (req: NextApiRequest & { user: any }, res: NextApiResponse) => {
    const { id , type} = req.body;
    let invoice;
    if(_.isEqual(type, "general")){
      invoice = await General(req, res)
    }
    if(_.isEqual(type, "vm")){
      invoice = await VmInvoice(req, res)
    }



    // res.json({ general });
  }
);
