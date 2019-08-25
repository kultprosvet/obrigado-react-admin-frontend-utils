"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-ignore
const react_admin_1 = require("react-admin");
const api_request_1 = require("./data_provider/api_request");
const graphql_tag_1 = require("graphql-tag");
//let permissions = ''
function buildAuthProvider(url) {
    return (type, params) => {
        console.log(type, params);
        if (type === react_admin_1.AUTH_LOGIN) {
            try {
                const { username, password } = params;
                return api_request_1.apiRequest(url, graphql_tag_1.default `
                    mutation($username: String!, $password: String!) {
                        adminLogin(username: $username, password: $password) {
                            id
                            last_name
                            first_name                        
                        }
                    }
                `, {
                    username: username,
                    password: password,
                })
                    .then(data => {
                    // permissions = data.data.adminLogin.role
                    return Promise.resolve('SUCCESS');
                })
                    .catch(e => {
                    console.log('exc', e);
                    return Promise.reject();
                });
            }
            catch (e) {
                console.log('exc', e);
                return Promise.reject('Unknown method');
            }
        }
        if (type === react_admin_1.AUTH_CHECK) {
            return api_request_1.apiRequest(url, graphql_tag_1.default `
                    query {
                        admin{
                            id                                 
                        }
                    }
                `, {});
        }
        if (type === react_admin_1.AUTH_LOGOUT) {
            return api_request_1.apiRequest(url, graphql_tag_1.default `
                mutation {
                    logOut {
                        code
                    }
                }
            `, {})
                .then(data => {
                return Promise.resolve();
            })
                .catch(e => {
                console.log('exc', e);
                return Promise.resolve();
            });
        }
        if (type == react_admin_1.AUTH_GET_PERMISSIONS) {
            if (sessionStorage.getItem("permissions")) {
                return Promise.resolve(true);
            }
            else {
                return api_request_1.apiRequest(url, graphql_tag_1.default `
                    query {
                        admin{
                            id                                 
                        }
                    }
                `, {}).then(() => {
                    sessionStorage.setItem("permissions", "admin");
                    return Promise.resolve(true);
                });
            }
        }
        if (type === react_admin_1.AUTH_ERROR) {
            if (params.message.match(/GraphQL error: Access denied/)) {
                return Promise.reject('You are not authentificated');
            }
            return Promise.resolve();
        }
        return Promise.resolve();
    };
}
exports.buildAuthProvider = buildAuthProvider;
//# sourceMappingURL=auth_provider.js.map