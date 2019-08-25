"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-ignore
const react_admin_1 = require("react-admin");
const api_request_1 = require("./data_provider/api_request");
const graphql_tag_1 = require("graphql-tag");
//let permissions = ''
function buildAuthProvider(url, debug = false) {
    return (type, params) => {
        if (debug)
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
                            token                   
                        }
                    }
                `, {
                    username: username,
                    password: password,
                })
                    .then(data => {
                    return Promise.resolve('SUCCESS');
                })
                    .catch(e => {
                    console.error('exc', e);
                    return Promise.reject();
                });
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
                        }
                    }
                `, {});
        }
        if (type === react_admin_1.AUTH_LOGOUT) {
            sessionStorage.clear();
            return api_request_1.apiRequest(url, graphql_tag_1.default `
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
                console.log('exc', e);
                return Promise.resolve();
            });
        }
        if (type == react_admin_1.AUTH_GET_PERMISSIONS) {
            if (sessionStorage.getItem("permissions")) {
                //@ts-ignore
                return Promise.resolve(JSON.parse(sessionStorage.getItem('permissions')));
            }
            else {
                return api_request_1.apiRequest(url, graphql_tag_1.default `
                    query {
                        adminCheck{
                            id                                 
                        }
                    }
                `, {}).then(() => {
                    //TODO  fetch permissions from server
                    sessionStorage.setItem("permissions", JSON.stringify(["admin"]));
                    return Promise.resolve(["admin"]);
                });
            }
        }
        if (type === react_admin_1.AUTH_ERROR) {
            if (params.message.match(/GraphQL error: Access denied/)) {
                return Promise.reject('You are not  authentificated');
            }
            return Promise.resolve();
        }
        return Promise.resolve();
    };
}
exports.buildAuthProvider = buildAuthProvider;
//# sourceMappingURL=auth_provider.js.map