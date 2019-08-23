"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_client_1 = require("apollo-client");
const apollo_cache_inmemory_1 = require("apollo-cache-inmemory");
const apollo_link_http_1 = require("apollo-link-http");
const graphql_tag_1 = require("graphql-tag");
const upload_file_decorator_1 = require("./upload_file_decorator");
//@ts-ignore
const ra_data_graphql_1 = require("ra-data-graphql");
//@ts-ignore
const buildQuery = introspectionResults => (raFetchType, resourceName, params) => {
    //console.log('DATA_PROVIDER', raFetchType, resourceName, params)
    //  console.log('introspection', introspectionResults)
    switch (raFetchType) {
        case 'GET_LIST':
            let methodName = `admin${resourceName}List`;
            let fieldList = '';
            if (params.filter &&
                params.filter.graphql_fields) {
                fieldList = params.filter.graphql_fields;
            }
            else {
                fieldList = gqlGetFieldList(resourceName, introspectionResults);
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
                        ${gqlGetFieldList(resourceName, introspectionResults)}
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
                        ${gqlGetFieldList(resourceName, introspectionResults)}
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
                fieldList = gqlGetFieldList(resourceName, introspectionResults);
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
        case 'UPDATE':
            methodName = `admin${resourceName}Update`;
            console.log('UPDATE', params.data);
            return {
                query: graphql_tag_1.default `
                    mutation ${methodName}($id:Int!,$data:${resourceName}Input!) {
                        ${methodName}(id:$id,data:$data){
                        ${gqlGetFieldList(resourceName, introspectionResults)}
                    }
                    }
                `,
                variables: {
                    id: parseInt(params.id),
                    data: buildUploadData(params.data, `${resourceName}Input`, introspectionResults),
                },
                parseResponse: (response) => {
                    console.log('RESPOMSE', response);
                    return {
                        data: response.data[methodName],
                    };
                },
            };
        case 'UPDATE_MANY':
            methodName = `admin${resourceName}UpdateMany`;
            return {
                query: graphql_tag_1.default `
                    mutation ${methodName}($ids:[Int!]!,$data:${resourceName}Input!) {
                        ${methodName}(ids:$ids,data:$data){
                            ids
                        }
                    }
                `,
                variables: {
                    ids: parseInt(params.ids),
                    data: buildUploadData(params.data, `${resourceName}Input`, introspectionResults),
                },
                parseResponse: (response) => ({
                    data: response.data[methodName].ids,
                }),
            };
        case 'CREATE':
            methodName = `admin${resourceName}Create`;
            return {
                query: graphql_tag_1.default `
                    mutation ${methodName}($data:${resourceName}Input!) {
                        ${methodName}(data:$data){
                        ${gqlGetFieldList(resourceName, introspectionResults)}
                    }
                    }
                `,
                variables: {
                    data: buildUploadData(params.data, `${resourceName}Input`, introspectionResults),
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
                         ${gqlGetFieldList(resourceName, introspectionResults)}
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
                    ids: parseInt(params.ids),
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
function gqlGetType(typName, introspectionResults) {
    for (let type of introspectionResults.types) {
        if (type.name === typName) {
            return type;
        }
    }
    return null;
}
exports.gqlGetType = gqlGetType;
function gqlGetFieldList(typName, introspectionResults, depth = 2) {
    //  console.log('gqlGetFieldList', typName, depth)
    for (let type of introspectionResults.types) {
        if (type.name === typName) {
            let fields = type.fields.map((item) => {
                let typeInfo = getFieldTypeAndName(item.type);
                //console.log('FIELD', typName, item, typeInfo, depth)
                if (depth == 1 &&
                    (typeInfo.type === 'OBJECT' ||
                        typeInfo.itemType === 'OBJECT'))
                    return '';
                if (typeInfo.type === 'LIST' &&
                    typeInfo.itemType === 'OBJECT') {
                    return `${item.name} {${gqlGetFieldList(typeInfo.typeName, introspectionResults, depth - 1)}}`;
                }
                else if (typeInfo.type === 'OBJECT') {
                    return `${item.name} {${gqlGetFieldList(typeInfo.typeName, introspectionResults, depth - 1)}}`;
                }
                else {
                    return item.name;
                }
            });
            return fields.join(',');
        }
    }
    return '';
}
exports.gqlGetFieldList = gqlGetFieldList;
function getFieldTypeAndName(type) {
    if (type.kind === 'NON_NULL') {
        return getFieldTypeAndName(type.ofType);
    }
    if (type.kind === 'LIST') {
        let types = getFieldTypeAndName(type.ofType);
        return {
            type: 'LIST',
            itemType: types.type,
            typeName: types.typeName,
        };
    }
    if (type.kind === 'OBJECT') {
        return {
            type: 'OBJECT',
            itemType: 'OBJECT',
            typeName: type.name,
        };
    }
    return {
        type: 'SCALAR',
        itemType: 'SCALAR',
        typeName: type.name,
    };
}
function buildUploadData(data, inputTypeName, introspectionResults) {
    if (!data)
        return null;
    let type = gqlGetType(inputTypeName, introspectionResults);
    let out = {};
    for (let f of type.inputFields) {
        // console.log('UPD DATA F', f, 'data', data)
        if (f.type.kind == 'SCALAR' ||
            (f.type.kind == 'NON_NULL' && f.type.ofType.kind === 'SCALAR')) {
            out[f.name] = data[f.name];
        }
        else if (f.type.kind == 'INPUT_OBJECT' ||
            (f.type.kind == 'NON_NULL' && f.type.ofType.kind === 'INPUT_OBJECT')) {
            // console.log('UPD DATA O', f, 'data', data)
            out[f.name] = buildUploadData(data[f.name], f.type.name, introspectionResults);
        }
        else if (f.type.ofType.kind === 'LIST') {
            if (f.type.ofType.ofType.ofType.kind !== 'SCALAR') {
                let listItemType = f.type.ofType.ofType.ofType.name;
                //  console.log(listItemType, f)
                out[f.name] = [];
                for (let item of data[f.name]) {
                    out[f.name].push(buildUploadData(item, listItemType, introspectionResults));
                }
            }
            else {
                out[f.name] = data[f.name];
            }
        }
    }
    //console.log('UPD DATA', out)
    return out;
}
function getListParams(p) {
    const params = Object.assign({}, p);
    if (p.filter) {
        params.filter = [];
        for (let k in p.filter) {
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
async function buildObrigadoDataProvider(apiUrl, schema) {
    const apolloClient = new apollo_client_1.ApolloClient({
        link: apollo_link_http_1.createHttpLink({ uri: apiUrl }),
        cache: new apollo_cache_inmemory_1.InMemoryCache(),
        defaultOptions: {
            //@ts-ignore
            fetchPolicy: 'no-cache',
        },
    });
    let dataProvider = await ra_data_graphql_1.default({
        client: apolloClient,
        introspection: { schema },
        buildQuery,
    });
    return upload_file_decorator_1.convertFilesToBase64(dataProvider);
}
exports.buildObrigadoDataProvider = buildObrigadoDataProvider;
//# sourceMappingURL=index.js.map