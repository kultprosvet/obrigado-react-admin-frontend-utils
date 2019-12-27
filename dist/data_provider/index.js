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
const apollo_client_1 = require("apollo-client");
const apollo_cache_inmemory_1 = require("apollo-cache-inmemory");
const apollo_link_http_1 = require("apollo-link-http");
const graphql_tag_1 = require("graphql-tag");
const upload_file_decorator_1 = require("./upload_file_decorator");
//@ts-ignore
const ra_data_graphql_1 = require("ra-data-graphql");
const buildUploadData_1 = require("./buildUploadData");
const introspectionUtils_1 = require("./introspectionUtils");
//@ts-ignore
const buildQuery = introspectionResults => (raFetchType, resourceName, params) => {
    //console.log('DATA_PROVIDER', raFetchType, resourceName, params)
    //  console.log('introspection', introspectionResults)
    let methodName = '';
    let inputDataTypeName = '';
    let fieldList = '';
    switch (raFetchType) {
        case 'GET_LIST':
            methodName = `admin${resourceName}List`;
            fieldList = '';
            if (params.filter &&
                params.filter.graphql_fields) {
                fieldList = params.filter.graphql_fields;
            }
            else {
                fieldList = introspectionUtils_1.gqlGetFieldList(resourceName, introspectionResults);
            }
            return {
                query: graphql_tag_1.default `
                    query ${methodName}($params:ReactAdminListParams!) {
                        ${methodName}(params:$params){
                            data{${fieldList}}
                            total
                        }
                    }
                `,
                variables: getListParams(params),
                parseResponse: (response) => ({
                    data: response.data[methodName].data,
                    total: response.data[methodName].total,
                }),
            };
        case 'GET_ONE':
            methodName = `admin${resourceName}GetOne`;
            return {
                query: graphql_tag_1.default `
                    query ${methodName}($id:String!) {
                        ${methodName}(id:$id){
                        ${introspectionUtils_1.gqlGetFieldList(resourceName, introspectionResults)}
                    }
                    }
                `,
                variables: { id: `${params.id}` },
                parseResponse: (response) => ({
                    data: response.data[methodName],
                }),
            };
        case 'GET_MANY':
            methodName = `admin${resourceName}GetMany`;
            return {
                query: graphql_tag_1.default `
                    query ${methodName}($ids:[Int!]!) {
                        ${methodName}(ids:$ids){
                        ${introspectionUtils_1.gqlGetFieldList(resourceName, introspectionResults)}
                    }
                    }
                `,
                variables: { ids: params.ids },
                parseResponse: (response) => ({
                    data: response.data[methodName],
                }),
            };
        case 'GET_MANY_REFERENCE':
            methodName = `admin${resourceName}GetManyReference`;
            fieldList = '';
            if (params.filter &&
                params.filter.graphql_fields) {
                fieldList = params.filter.graphql_fields;
            }
            else {
                fieldList = introspectionUtils_1.gqlGetFieldList(resourceName, introspectionResults);
            }
            return {
                query: graphql_tag_1.default `
                    query ${methodName}($params:ReactAdminGetManyReferenceParams!) {
                        ${methodName}(params:$params){
                            data{${fieldList}}
                            total
                        }
                    }
                `,
                variables: getListParams(params),
                parseResponse: (response) => ({
                    data: response.data[methodName].data,
                    total: response.data[methodName].total,
                }),
            };
        case 'UPDATE':
            methodName = `admin${resourceName}Update`;
            inputDataTypeName = introspectionUtils_1.getDataParamName(`admin${resourceName}Update`, introspectionResults);
            //console.log('UPDATE', params.data)
            return {
                query: graphql_tag_1.default `
                    mutation ${methodName}($id:Int!,$data:${inputDataTypeName}!) {
                        ${methodName}(id:$id,data:$data){
                        ${introspectionUtils_1.gqlGetFieldList(resourceName, introspectionResults)}
                    }
                    }
                `,
                variables: {
                    id: parseInt(params.id),
                    data: buildUploadData_1.buildUploadData(params.data, inputDataTypeName, introspectionResults),
                },
                parseResponse: (response) => {
                    //console.log('RESPOMSE', response)
                    return {
                        data: response.data[methodName],
                    };
                },
            };
        case 'UPDATE_MANY':
            methodName = `admin${resourceName}UpdateMany`;
            inputDataTypeName = introspectionUtils_1.getDataParamName(`admin${resourceName}UpdateMany`, introspectionResults);
            return {
                query: graphql_tag_1.default `
                    mutation ${methodName}($ids:[Int!]!,$data:${inputDataTypeName}!) {
                        ${methodName}(ids:$ids,data:$data){
                            ids
                        }
                    }
                `,
                variables: {
                    ids: parseInt(params.ids),
                    data: buildUploadData_1.buildUploadData(params.data, inputDataTypeName, introspectionResults),
                },
                parseResponse: (response) => ({
                    data: response.data[methodName].ids,
                }),
            };
        case 'CREATE':
            methodName = `admin${resourceName}Create`;
            inputDataTypeName = introspectionUtils_1.getDataParamName(`admin${resourceName}Create`, introspectionResults);
            return {
                query: graphql_tag_1.default `
                    mutation ${methodName}($data:${inputDataTypeName}!) {
                        ${methodName}(data:$data){
                        ${introspectionUtils_1.gqlGetFieldList(resourceName, introspectionResults)}
                    }
                    }
                `,
                variables: {
                    data: buildUploadData_1.buildUploadData(params.data, inputDataTypeName, introspectionResults),
                },
                parseResponse: (response) => ({
                    data: response.data[methodName],
                }),
            };
        case 'DELETE':
            methodName = `admin${resourceName}Delete`;
            return {
                query: graphql_tag_1.default `
                    mutation ${methodName}($id:Int!) {
                        ${methodName}(id:$id){
                         ${introspectionUtils_1.gqlGetFieldList(resourceName, introspectionResults)}
                         }
                    }
                `,
                variables: {
                    id: parseInt(params.id),
                },
                parseResponse: (response) => ({
                    data: response.data[methodName],
                }),
            };
        case 'DELETE_MANY':
            methodName = `admin${resourceName}DeleteMany`;
            return {
                query: graphql_tag_1.default `
                    mutation ${methodName}($ids:[Int!]!) {
                        ${methodName}(ids:$ids){
                       ids
                        }
                    }
                `,
                variables: {
                    ids: params.ids.map((id) => parseInt(id)),
                },
                parseResponse: (response) => ({
                    data: response.data[methodName].ids,
                }),
            };
    }
    /*
    const resource: any = introspectionResults.resource.find(
        r => r.type.name === resourceName,
    )*/
    return null;
};
function getListParams(p) {
    const params = Object.assign({}, p);
    if (p.filter) {
        params.filter = [];
        for (let k in p.filter) {
            if (k === 'graphql_fields')
                continue;
            if (p.filter[k] != undefined)
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
function buildObrigadoDataProvider(apiUrl, schema) {
    return __awaiter(this, void 0, void 0, function* () {
        const apolloClient = new apollo_client_1.ApolloClient({
            link: apollo_link_http_1.createHttpLink({ uri: apiUrl, credentials: 'include' }),
            cache: new apollo_cache_inmemory_1.InMemoryCache(),
            defaultOptions: {
                //@ts-ignore
                fetchPolicy: 'no-cache',
            },
        });
        let config = {
            client: apolloClient,
            buildQuery,
        };
        if (schema) {
            config.introspection = { schema };
        }
        let dataProvider = yield ra_data_graphql_1.default(config);
        return upload_file_decorator_1.convertFilesToBase64(dataProvider);
    });
}
exports.buildObrigadoDataProvider = buildObrigadoDataProvider;
//# sourceMappingURL=index.js.map