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
const api_request_1 = require("./data_provider/api_request");
const graphql_tag_1 = require("graphql-tag");
let API = 'http://localhost:4000/graphql';
const config = {
    init(url) {
        API = url;
    },
    getAPI() {
        return API;
    },
    getRolesList() {
        return __awaiter(this, void 0, void 0, function* () {
            let data;
            yield api_request_1.apiRequest(API, graphql_tag_1.default `query { getRoles }`, {})
                .then(response => data = response)
                .catch(e => console.log(e));
            return data.data.getRoles;
        });
    },
};
exports.default = config;
//# sourceMappingURL=config.js.map