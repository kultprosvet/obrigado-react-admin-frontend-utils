"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_link_http_1 = require("apollo-link-http");
const apollo_link_1 = require("apollo-link");
class ApiError extends Error {
}
async function apiRequest(url, gqlQuery, variables) {
    const operation = {
        query: gqlQuery,
        variables,
    };
    const token = localStorage.getItem('token');
    const headers = {};
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    const link = apollo_link_http_1.createHttpLink({
        uri: url,
    });
    const data = apollo_link_1.makePromise(apollo_link_1.execute(link, operation));
    if (data.errors) {
        let e = data.errors[0];
        let error = new ApiError(e.message);
        error.code = e.extensions.code;
        error.graphqlErrors = data.errors;
        throw error;
    }
    return data;
}
exports.apiRequest = apiRequest;
//# sourceMappingURL=api_request.js.map