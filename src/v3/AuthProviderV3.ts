import gql from "graphql-tag";
import { apiRequest } from "../data_provider/api_request";
import config from "../config";

export class AuthProviderV3 {
  url: string;
  debug: boolean;
  constructor(url: string, debug = false) {
    config.init(url);
    this.url = url;
    this.debug = debug;
  }

  login(params: any) {
    if (this.debug) console.log(params);
    try {
      const { username, password } = params;
      return apiRequest(
        this.url,
        gql`
          mutation($username: String!, $password: String!) {
            adminLogin(username: $username, password: $password) {
              id
              last_name
              first_name
              token
            }
          }
        `,
        {
          username: username,
          password: password
        }
      )
        .then(data => {
          localStorage.setItem("logged_in","true")
          return Promise.resolve("SUCCESS");
        })
        .catch(e => {
          if (this.debug) console.error("exc", e);
          return Promise.reject(e);
        });
    } catch (e) {
      if (this.debug) console.error("exc", e);
      return Promise.reject(e.message);
    }
  }
  logout() {
    localStorage.removeItem("logged_in");
    return apiRequest(
      this.url,
      gql`
        mutation {
          adminLogOut {
            code
          }
        }
      `,
      {}
    )
      .then(data => {
        return Promise.resolve();
      })
      .catch(e => {
        if (this.debug) console.log("exc", e);
        return Promise.resolve();
      });
  }

  async checkAuth() {
    if (localStorage.getItem("logged_in")) return  Promise.resolve()
    else return Promise.reject()
    try {
    const res=  await apiRequest(
          this.url,
          gql`
            query {
              adminCheck {
                id
              }
            }
          `,
          {}
      );
      return res.data.adminCheck.id!=null
    }catch (e) {
      return Promise.reject()
    }

  }

  checkError(error: any) {
    //console.log('ERROR',error)
    const status = error.status;
    if (status === 401 || status === 403 || error.message.toLowerCase().includes('access denied')) {
      localStorage.removeItem("logged_in");
      return Promise.reject();
    }
//    console.error('ERROR',error)
    return Promise.resolve();
  }

  async getPermissions() {
    try {
      let data: any = await apiRequest(
        this.url,
        gql`
          query {
            adminCheck {
              id
              permissions
            }
          }
        `,
        {}
      );
      return data.data.adminCheck.permissions;
    } catch (e) {
      if (this.debug) console.log(e);
      return Promise.resolve([]);
    }
  }
}
