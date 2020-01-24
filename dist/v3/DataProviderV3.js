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
const __1 = require("..");
const introspectionUtils_1 = require("../data_provider/introspectionUtils");
const api_request_1 = require("../data_provider/api_request");
const upload_file_decorator_1 = require("../data_provider/upload_file_decorator");
const introspectionUtils_2 = require("../data_provider/introspectionUtils");
class DataProviderV3 {
    constructor(url, introspection) {
        this.url = url;
        this.introspection = introspection;
        console.log('introspection', introspection);
    }
    getList(resourceName, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let methodName = `admin${introspectionUtils_2.checkForAlias(resourceName)}List`;
            let fieldList = '';
            if (params.filter &&
                params.filter.graphql_fields) {
                fieldList = params.filter.graphql_fields;
            }
            else {
                fieldList = __1.gqlGetFieldList(introspectionUtils_2.checkForAlias(resourceName), this.introspection);
            }
            let query = graphql_tag_1.default `
                    query ${methodName}($params:ReactAdminListParams!) {
                        ${methodName}(params:$params){
                            data{${fieldList}}
                            total
                        }
                    }
                `;
            let variables = getListParams(params);
            const response = yield api_request_1.apiRequest(this.url, query, variables);
            console.log('getList fired:', methodName, response.data[methodName]);
            return response.data[methodName];
        });
    }
    getOne(resourceName, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let methodName = `admin${introspectionUtils_2.checkForAlias(resourceName)}GetOne`;
            let query = graphql_tag_1.default `
                    query ${methodName}($id:String!) {
                        ${methodName}(id:$id){
                        ${__1.gqlGetFieldList(introspectionUtils_2.checkForAlias(resourceName), this.introspection)}
                    }
                    }
                `;
            let variables = { id: `${params.id}` };
            const response = yield api_request_1.apiRequest(this.url, query, variables);
            console.log('getOne fired:', methodName, { data: response.data[methodName] });
            return {
                data: response.data[methodName]
            };
        });
    }
    getMany(resourceName, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let methodName = `admin${introspectionUtils_2.checkForAlias(resourceName)}GetMany`;
            let query = graphql_tag_1.default `
                    query ${methodName}($ids:[Int!]!) {
                        ${methodName}(ids:$ids){
                        ${__1.gqlGetFieldList(introspectionUtils_2.checkForAlias(resourceName), this.introspection)}
                    }
                    }
                `;
            let variables = { ids: params.ids };
            const response = yield api_request_1.apiRequest(this.url, query, variables);
            console.log('getMany fired:', methodName, response.data[methodName]);
            return response.data[methodName];
        });
    }
    getManyReference(resourceName, params) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('getManyReference params', params);
            let methodName = `admin${introspectionUtils_2.checkForAlias(resourceName)}GetManyReference`;
            let fieldList = '';
            if (params.filter &&
                params.filter.graphql_fields) {
                fieldList = params.filter.graphql_fields;
            }
            else {
                fieldList = __1.gqlGetFieldList(introspectionUtils_2.checkForAlias(resourceName), this.introspection);
            }
            let query = graphql_tag_1.default `
                    query ${methodName}($params:ReactAdminGetManyReferenceParams!) {
                        ${methodName}(params:$params){
                            data{${fieldList}}
                            total
                        }
                    }
                `;
            let variables = getListParams(params);
            const response = yield api_request_1.apiRequest(this.url, query, variables);
            console.log('getManyReference fired:', methodName, response.data[methodName]);
            return response.data[methodName];
        });
    }
    update(resourceName, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let methodName = `admin${introspectionUtils_2.checkForAlias(resourceName)}Update`;
            let inputDataTypeName = introspectionUtils_1.getDataParamName(methodName, this.introspection);
            let data = params.data;
            yield upload_file_decorator_1.iterateDataAndReplaceFiles(data);
            let query = graphql_tag_1.default `
                    mutation ${methodName}($id:Int!,$data:${inputDataTypeName}!) {
                        ${methodName}(id:$id,data:$data){
                        ${__1.gqlGetFieldList(introspectionUtils_2.checkForAlias(resourceName), this.introspection)}
                    }
                    }
                `;
            let variables = {
                id: parseInt(params.id),
                data: __1.buildUploadData(data, inputDataTypeName, this.introspection)
            };
            console.log('update variables', variables);
            const response = yield api_request_1.apiRequest(this.url, query, variables);
            console.log('update fired:', methodName, { data: response.data[methodName] });
            return {
                data: response.data[methodName]
            };
        });
    }
    updateMany(resourceName, params) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('updateMany fired');
            let methodName = `admin${introspectionUtils_2.checkForAlias(resourceName)}UpdateMany`;
            let inputDataTypeName = introspectionUtils_1.getDataParamName(methodName, this.introspection);
            let data = params.data;
            yield upload_file_decorator_1.iterateDataAndReplaceFiles(data);
            let query = graphql_tag_1.default `
                    mutation ${methodName}($ids:[Int!]!,$data:${inputDataTypeName}!) {
                        ${methodName}(ids:$ids,data:$data){
                            ids
                        }
                    }
                `;
            let variables = {
                ids: parseInt(params.ids),
                data: __1.buildUploadData(data, inputDataTypeName, this.introspection)
            };
            const response = yield api_request_1.apiRequest(this.url, query, variables);
            console.log('updateMany fired: ', methodName, response.data[methodName]);
            return response.data[methodName];
        });
    }
    create(resourceName, params) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('create fired');
            let methodName = `admin${introspectionUtils_2.checkForAlias(resourceName)}Create`;
            let inputDataTypeName = introspectionUtils_1.getDataParamName(methodName, this.introspection);
            let data = params.data;
            yield upload_file_decorator_1.iterateDataAndReplaceFiles(data);
            let query = graphql_tag_1.default `
                    mutation ${methodName}($data:${inputDataTypeName}!) {
                        ${methodName}(data:$data){
                        ${__1.gqlGetFieldList(introspectionUtils_2.checkForAlias(resourceName), this.introspection)}
                    }
                    }
                `;
            let variables = {
                data: __1.buildUploadData(data, inputDataTypeName, this.introspection),
            };
            const response = yield api_request_1.apiRequest(this.url, query, variables);
            console.log('create fired: ', methodName, { data: response.data[methodName] });
            return {
                data: response.data[methodName]
            };
        });
    }
    delete(resourceName, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let methodName = `admin${introspectionUtils_2.checkForAlias(resourceName)}Delete`;
            let query = graphql_tag_1.default `
                    mutation ${methodName}($id:Int!) {
                        ${methodName}(id:$id){
                         ${__1.gqlGetFieldList(introspectionUtils_2.checkForAlias(resourceName), this.introspection)}
                         }
                    }
                `;
            let variables = { id: parseInt(params.id) };
            const response = yield api_request_1.apiRequest(this.url, query, variables);
            console.log('delete fired:', methodName, { data: response.data[methodName] });
            return {
                data: response.data[methodName]
            };
        });
    }
    deleteMany(resourceName, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let methodName = `admin${introspectionUtils_2.checkForAlias(resourceName)}DeleteMany`;
            let query = graphql_tag_1.default `
                    mutation ${methodName}($ids:[Int!]!) {
                        ${methodName}(ids:$ids){
                       ids
                        }
                    }
                `;
            let variables = { ids: params.ids.map((id) => parseInt(id)) };
            let response = yield api_request_1.apiRequest(this.url, query, variables);
            console.log('deleteMany fired:', methodName, { data: response.data[methodName] });
            return {
                data: response.data[methodName]
            };
        });
    }
}
exports.DataProviderV3 = DataProviderV3;
function getListParams(p) {
    const params = Object.assign({}, p);
    if (p.filter) {
        params.filter = [];
        for (let k in p.filter) {
            if (k === 'graphql_fields')
                continue;
            if (p.filter[k])
                params.filter.push({
                    field: k,
                    value: `${p.filter[k]}`,
                });
        }
    }
    else {
        delete params.filter;
    }
    return { params };
}
//# sourceMappingURL=DataProviderV3.js.map