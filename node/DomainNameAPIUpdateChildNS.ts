import React from "react";
import got from "got";

const DOMAINAPI_ACCESS_POINT = process.env.DOMAINAPI_ACCESS_POINT;
const DOMAINAPI_USERNAME = process.env.DOMAINAPI_USERNAME;
const DOMAINAPI_PASSWORD = process.env.DOMAINAPI_PASSWORD;

const DomainNameAPIUpdateChildNS = (input: any) => {
  return new Promise((resolve, reject) => {
    let nsIPs = input?.nsIPs?.map((item: any) => {
      return item?.value;
    });

    // console.log(nsIPs);


    got
      .post(`${DOMAINAPI_ACCESS_POINT}/api/updatechildns`, {
        json: {
          username: DOMAINAPI_USERNAME,
          password: DOMAINAPI_PASSWORD,
          ...input,
          nsIPs,
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

export { DomainNameAPIUpdateChildNS };
