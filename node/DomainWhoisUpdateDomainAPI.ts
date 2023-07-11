import React from "react";
import got from "got";
import { WhoisFormInterface } from "../Types/WhoisFormInterface";

const DOMAINAPI_ACCESS_POINT = process.env.DOMAINAPI_ACCESS_POINT;
const DOMAINAPI_USERNAME = process.env.DOMAINAPI_USERNAME;
const DOMAINAPI_PASSWORD = process.env.DOMAINAPI_PASSWORD;

const DomainWhoisUpdateDomainAPI = (
  whois: WhoisFormInterface,
  domain: string
) => {
  return new Promise((resolve, reject) => {
    got
      .post(`${DOMAINAPI_ACCESS_POINT}/api/updatewhois`, {
        json: {
          username: DOMAINAPI_USERNAME,
          password: DOMAINAPI_PASSWORD,
          whois,
          domain,
        },
      })
      .json()
      .then((result: any) => {
        // console.log(result);

        resolve(result);
      })
      .catch((err) => {
        // console.log(err);

        resolve(err);
      });
  });
};

export { DomainWhoisUpdateDomainAPI };
