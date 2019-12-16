import gql from "graphql-tag";
import {apiRequest} from "../data_provider/api_request";


export class AuthProviderV3 {
  url:string
  debug:boolean
  constructor(url: string, debug = false) {
    this.url = url;
    this.debug = debug;
  }

  login(params: any) {
    if (this.debug) console.log(params)
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
          return Promise.resolve("SUCCESS");
        })
        .catch(e => {
          console.error("exc", e);
          return Promise.reject();
        });
    } catch (e) {
      console.error("exc", e);
      return Promise.reject("Unknown method");
    }
  }
  logout() {
    sessionStorage.clear();
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
        console.log("exc", e);
        return Promise.resolve();
      });
  }

  checkAuth() {
    return apiRequest(
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
  }

  checkError (error:any) {
    const status = error.status;
    if (status === 401 || status === 403) {
    localStorage.removeItem('token');
    return Promise.reject();
  }
  return Promise.resolve();
}

  getPermissions() {
    if (sessionStorage.getItem("permissions")) {
      //@ts-ignore
      return Promise.resolve(JSON.parse(sessionStorage.getItem("permissions")));
    } else {
      return apiRequest(
        this.url,
        gql`
          query {
            adminCheck {
              id
            }
          }
        `,
        {}
      ).then(() => {
        //TODO  fetch permissions from server
        sessionStorage.setItem("permissions", JSON.stringify(["admin"]));
        return Promise.resolve(["admin"]);
      });
    }
  }
}
