import _ from "lodash"
import { Products, SSLCertificate } from "../database";

export const getSSLProduct = async (context: any) => {

    const {productId} =  context.query

    return new Promise((resolve, reject) => {

        SSLCertificate.find({orderform: true}).sort({sequence: -1}).then((result:any) => {

            resolve(JSON.parse(JSON.stringify(result)))
        }).catch((err:any) => {
            resolve({})
        });

    });


}