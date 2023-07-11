import React from "react";
import got from "got";


const DOMAINAPI_ACCESS_POINT = process.env.DOMAINAPI_ACCESS_POINT;
const DOMAINAPI_USERNAME = process.env.DOMAINAPI_USERNAME;
const DOMAINAPI_PASSWORD = process.env.DOMAINAPI_PASSWORD;

const DomainPrivacyIDUpdate = (domain: string, status: boolean) => {
  return new Promise((resolve, reject) => {
    got
      .post(`${DOMAINAPI_ACCESS_POINT}/api/privacyupdate`, {
        json: {
          username: DOMAINAPI_USERNAME,
          password: DOMAINAPI_PASSWORD,
          domain: domain,
          status: status,
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

export { DomainPrivacyIDUpdate };
