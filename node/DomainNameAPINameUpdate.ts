import React from "react";
import got from "got";

const DOMAINAPI_ACCESS_POINT = process.env.DOMAINAPI_ACCESS_POINT;
const DOMAINAPI_USERNAME = process.env.DOMAINAPI_USERNAME;
const DOMAINAPI_PASSWORD = process.env.DOMAINAPI_PASSWORD;

const DomainNameAPINameUpdate = (dnsList: [], domain: string) => {
  return new Promise((resolve, reject) => {

    let nslist = dnsList.filter((item:any) => item?.value !== "").map((item: any) => {
      return item?.value;
    });

    // console.log(nslist);


    got
      .post(`${DOMAINAPI_ACCESS_POINT}/api/nameserverupdate`, {
        json: {
          username: DOMAINAPI_USERNAME,
          password: DOMAINAPI_PASSWORD,
          domain,
          nslist,
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

export { DomainNameAPINameUpdate };
