import axios, { AxiosInstance } from "axios";
import _ from "lodash";

export class ProxmoxClient {
  private baseURL?: string;
  private username?: string;
  private password?: string;
  private CSRFToken?: string;
  private axiosInstance: AxiosInstance;
  private Cookie?: string;

  constructor(baseURL: string, username: string, password: string) {
    this.baseURL = baseURL;
    this.username = username;
    this.password = password;
    // this.CSRFToken = CSRFToken;
    // this.Cookie = Cookie;

    this.axiosInstance = axios.create({
      baseURL,
      auth: {
        username,
        password,
      },
    });
  }

  async get(url: string): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        this.axiosInstance
          .post(`/access/ticket`, {
            username: this.username,
            password: this.password,
            realm: "pam",
          })
          .then(async (instant: any) => {
            this.axiosInstance
              .get(url, {
                headers: {
                  CSRFPreventionToken: `${instant.data.data.CSRFPreventionToken}`,
                  Cookie: `PVEAuthCookie=${instant.data.data.ticket}`,
                },
              })
              .then((result: any) => {

                resolve(result.data);
              })
              .catch((err) => {
                reject(err);
              });
          });
      });
    } catch (error: any) {
      throw new Error(`GET request to ${url} failed: ${error.message}`);
    }
  }

  async post(url: string, data: any): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        this.axiosInstance
          .post(`/access/ticket`, {
            username: this.username,
            password: this.password,
            realm: "pam",
          })
          .then(async (instant: any) => {
            const response = await this.axiosInstance.post(
              url,
              { ...data },
              {
                headers: {
                  CSRFPreventionToken: `${instant.data.data.CSRFPreventionToken}`,
                  Cookie: `PVEAuthCookie=${instant.data.data.ticket}`,
                },
              }
            );

            resolve(response.data);
          })
          .catch((err: any) => {
            reject(err.data);
          });
      });
    } catch (error: any) {
      throw new Error(`POST request to ${url} failed: ${error.message}`);
    }
  }

  async terminalPost(url: string, data: any): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        this.axiosInstance
          .post(`/access/ticket`, {
            username: this.username,
            password: this.password,
            realm: "pam",
          })
          .then(async (instant: any) => {
            const response = await this.axiosInstance.post(
              url,
              { ...data },
              {
                headers: {
                  CSRFPreventionToken: `${instant.data.data.CSRFPreventionToken}`,
                  Cookie: `PVEAuthCookie=${instant.data.data.ticket}`,
                },
              }
            );

            resolve({ ...response.data, instant: instant });
          })
          .catch((err: any) => {
            reject(err.data);
          });
      });
    } catch (error: any) {
      throw new Error(`POST request to ${url} failed: ${error.message}`);
    }
  }

  async put(url: string, data: any): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        this.axiosInstance
          .post(`/access/ticket`, {
            username: this.username,
            password: this.password,
            realm: "pam",
          })
          .then(async (instant: any) => {
            this.axiosInstance
              .put(url, data, {
                headers: {
                  CSRFPreventionToken: `${instant.data.data.CSRFPreventionToken}`,
                  Cookie: `PVEAuthCookie=${instant.data.data.ticket}`,
                },
              })
              .then((result: any) => {
                resolve(result.data);
              })
              .catch((err: any) => {
                console.log(err.response);

                reject(err);
              });
          });
      });
    } catch (error: any) {
      throw new Error(`PUT request to ${url} failed: ${error.message}`);
    }
  }

  async delete(url: string, data: any): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        this.axiosInstance
          .post(`/access/ticket`, {
            username: this.username,
            password: this.password,
            realm: "pam",
          })
          .then(async (instant: any) => {
            this.axiosInstance
              .delete(url, {
                headers: {
                  CSRFPreventionToken: `${instant.data.data.CSRFPreventionToken}`,
                  Cookie: `PVEAuthCookie=${instant.data.data.ticket}`,
                },
              })
              .then((result: any) => {
                console.log(result);

                resolve(result.data);
              })
              .catch((err: any) => {
                reject(err);
              });
          });
      });
    } catch (error: any) {
      throw new Error(`DELETE request to ${url} failed: ${error.message}`);
    }
  }
}
