import https from "https";
import xml2js from "xml2js";

interface PleskDomain {
  id: string;
  name: string;
}

export class PleskXMLClient {
  private readonly host: string;
  private readonly username: string;
  private readonly password: string;
  private readonly port:number;

  constructor(host: string, port:number, username: string, password: string) {
    this.host = host;
    this.username = username;
    this.password = password;
    this.port = port;
  }

  async getPleskCall(requestXml: string): Promise<PleskDomain | null> {
    const requestOptions = {
      hostname: this.host,
      port: this.port,
      path: "/enterprise/control/agent.php",
      method: "POST",
      headers: {
        "Content-Type": "text/xml",
        HTTP_AUTH_LOGIN: this.username,
        HTTP_AUTH_PASSWD: this.password,
      },
    };

    return new Promise((resolve, reject) => {
      const request = https.request(requestOptions, (response) => {
        let responseData = "";

        response.on("data", (chunk) => {
          responseData += chunk;
        });

        response.on("end", () => {
          xml2js.parseString(responseData, (error: any, result: any) => {
            if (error) {
              reject(error);
            } else {
              if (result) {
                resolve(result);
              } else {
                resolve(null);
              }
            }
          });
        });
      });

      request.on("error", (error) => {
        reject(error);
      });

      request.write(requestXml);
      request.end();
    });
  }
}

export default PleskXMLClient;
