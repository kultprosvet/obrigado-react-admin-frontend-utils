"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = require("graphql-tag");
const api_request_1 = require("../data_provider/api_request");
class AuthProviderV3 {
    constructor(url, debug = false) {
        this.url = url;
        this.debug = debug;
    }
    login(params) {
        if (this.debug)
            console.log(params);
        try {
            const { username, password } = params;
            return api_request_1.apiRequest(this.url, graphql_tag_1.default `
          mutation($username: String!, $password: String!) {
            adminLogin(username: $username, password: $password) {
              id
              last_name
              first_name
              token
            }
          }
        `, {
                username: username,
                password: password
            })
                .then(data => {
                return Promise.resolve("SUCCESS");
            })
                .catch(e => {
                if (this.debug)
                    console.error("exc", e);
                return Promise.reject();
            });
        }
        catch (e) {
            if (this.debug)
                console.error("exc", e);
            return Promise.reject("Unknown method");
        }
    }
    logout() {
        sessionStorage.clear();
        return api_request_1.apiRequest(this.url, graphql_tag_1.default `
        mutation {
          adminLogOut {
            code
          }
        }
      `, {})
            .then(data => {
            return Promise.resolve();
        })
            .catch(e => {
            console.log("exc", e);
            return Promise.resolve();
        });
    }
    checkAuth() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield api_request_1.apiRequest(this.url, graphql_tag_1.default `
        query {
          adminCheck {
            id
            permissions
          }
        }
      `, {});
        });
    }
    checkError(error) {
        const status = error.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem('token');
            return Promise.reject();
        }
        return Promise.resolve();
    }
    getPermissions() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield api_request_1.apiRequest(this.url, graphql_tag_1.default `
                    query {
                        adminCheck{
                            id
                            permissions                                 
                        }
                    }
                `, {});
                return data.data.adminCheck.permissions;
            }
            catch (e) {
                if (this.debug)
                    console.log(e);
                return Promise.resolve([]);
            }
        });
    }
}
exports.AuthProviderV3 = AuthProviderV3;
//# sourceMappingURL=AuthProviderV3.js.map