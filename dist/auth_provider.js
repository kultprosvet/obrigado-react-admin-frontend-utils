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
//@ts-ignore
const react_admin_1 = require("react-admin");
const api_request_1 = require("./data_provider/api_request");
const graphql_tag_1 = require("graphql-tag");
function buildAuthProvider(url, debug = false) {
    return (type, params) => __awaiter(this, void 0, void 0, function* () {
        if (debug)
            console.log(type, params);
        if (type === react_admin_1.AUTH_LOGIN) {
            try {
                const { username, password } = params;
                yield api_request_1.apiRequest(url, graphql_tag_1.default `
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
                    password: password,
                });
                return Promise.resolve('SUCCESS');
            }
            catch (e) {
                console.error('exc', e);
                return Promise.reject('Unknown method');
            }
        }
        if (type === react_admin_1.AUTH_CHECK) {
            return api_request_1.apiRequest(url, graphql_tag_1.default `
                    query {
                        adminCheck{
                            id
                            permissions                                 
                        }
                    }
                `, {});
        }
        if (type === react_admin_1.AUTH_LOGOUT) {
            try {
                sessionStorage.clear();
                yield api_request_1.apiRequest(url, graphql_tag_1.default `
                mutation {
                    adminLogOut {
                        code
                    }
                }
            `, {});
                return Promise.resolve();
            }
            catch (e) {
                return Promise.resolve();
            }
        }
        if (type == react_admin_1.AUTH_GET_PERMISSIONS) {
            try {
                let data = yield api_request_1.apiRequest(url, graphql_tag_1.default `
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
                if (debug)
                    console.log(e);
                return Promise.resolve([]);
            }
        }
        if (type === react_admin_1.AUTH_ERROR) {
            if (params.message.match(/GraphQL error: Access denied/)) {
                return Promise.reject('You are not authenticated');
            }
            return Promise.resolve();
        }
        return Promise.resolve();
    });
}
exports.buildAuthProvider = buildAuthProvider;
//# sourceMappingURL=auth_provider.js.map