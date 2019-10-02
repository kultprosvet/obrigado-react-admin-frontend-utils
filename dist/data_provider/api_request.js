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
const apollo_link_http_1 = require("apollo-link-http");
const apollo_link_1 = require("apollo-link");
class ApiError extends Error {
}
function apiRequest(url, gqlQuery, variables) {
    return __awaiter(this, void 0, void 0, function* () {
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
            credentials: 'include'
        });
        const data = yield apollo_link_1.makePromise(apollo_link_1.execute(link, operation));
        if (data.errors) {
            let e = data.errors[0];
            let error = new ApiError(e.message);
            error.code = e.extensions.code;
            error.graphqlErrors = data.errors;
            throw error;
        }
        return data;
    });
}
exports.apiRequest = apiRequest;
//# sourceMappingURL=api_request.js.map