import {ApolloClient} from 'apollo-client'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {createHttpLink} from 'apollo-link-http'

import gql from 'graphql-tag'
import {convertFilesToBase64} from "./upload_file_decorator";
//@ts-ignore
import buildGraphQLProvider from 'ra-data-graphql'
import {buildUploadData} from "./buildUploadData";
import {getDataParamName, gqlGetFieldList} from "./introspectionUtils";

export interface ObjectLiteral {
    [key: string]: any;
}

export interface DataQuery {
    query: any
    variables?: ObjectLiteral
    parseResponse?: (response: any) => any
}

//@ts-ignore
const buildQuery = introspectionResults => (
    raFetchType: string,
    resourceName: string,
    params: any,
) => {
    //console.log('DATA_PROVIDER', raFetchType, resourceName, params)
  //  console.log('introspection', introspectionResults)
    let methodName=''
    let inputDataTypeName=''
    let fieldList = ''
    switch (raFetchType) {
        case 'GET_LIST':
            methodName = `admin${resourceName}List`
            fieldList = ''
            if (params.filter &&
                params.filter.graphql_fields
            ) {
                fieldList =  params.filter.graphql_fields
            } else {
                fieldList = gqlGetFieldList(resourceName, introspectionResults)
            }
            return {
                query: gql`
                    query ${methodName}($params:ReactAdminListParams!) {
                        ${methodName}(params:$params){
                            data{${fieldList}}
                            total
                        }
                    }
                `,
                variables: getListParams(params),
                parseResponse: (response: any) => ({
                    data: response.data[methodName].data,
                    total: response.data[methodName].total,
                }),
            }
        case 'GET_ONE':
            methodName = `admin${resourceName}GetOne`
            return {
                query: gql`
                    query ${methodName}($id:String!) {
                        ${methodName}(id:$id){
                        ${gqlGetFieldList(resourceName, introspectionResults)}
                    }
                    }
                `,
                variables: { id: `${params.id}` },
                parseResponse: (response: any) => ({
                    data: response.data[methodName],
                }),
            }
        case 'GET_MANY':
            methodName = `admin${resourceName}GetMany`
            return {
                query: gql`
                    query ${methodName}($ids:[Int!]!) {
                        ${methodName}(ids:$ids){
                        ${gqlGetFieldList(resourceName, introspectionResults)}
                    }
                    }
                `,
                variables: { ids: params.ids },
                parseResponse: (response: any) => ({
                    data: response.data[methodName],
                }),
            }
        case 'GET_MANY_REFERENCE':
            methodName = `admin${resourceName}GetManyReference`
            fieldList = ''
            if (params.filter &&
                params.filter.graphql_fields
            ) {
                fieldList =  params.filter.graphql_fields
            } else {
                fieldList = gqlGetFieldList(resourceName, introspectionResults)
            }
            return {
                query: gql`
                    query ${methodName}($params:ReactAdminGetManyReferenceParams!) {
                        ${methodName}(params:$params){
                            data{${fieldList}}
                            total
                        }
                    }
                `,
                variables: getListParams(params),
                parseResponse: (response: any) => ({
                    data: response.data[methodName].data,
                    total: response.data[methodName].total,
                }),
            }
        case 'UPDATE':
            methodName = `admin${resourceName}Update`
            inputDataTypeName=getDataParamName(`admin${resourceName}Update`,introspectionResults)
            //console.log('UPDATE', params.data)
            return {
                query: gql`
                    mutation ${methodName}($id:Int!,$data:${inputDataTypeName}!) {
                        ${methodName}(id:$id,data:$data){
                        ${gqlGetFieldList(resourceName, introspectionResults)}
                    }
                    }
                `,
                variables: {
                    id: parseInt(params.id),
                    data: buildUploadData(
                        params.data,
                        inputDataTypeName,
                        introspectionResults,
                    ),
                },
                parseResponse: (response: any) => {
                    //console.log('RESPOMSE', response)
                    return {
                        data: response.data[methodName],
                    }
                },
            }
        case 'UPDATE_MANY':
            methodName = `admin${resourceName}UpdateMany`
            inputDataTypeName=getDataParamName(`admin${resourceName}UpdateMany`,introspectionResults)
            return {
                query: gql`
                    mutation ${methodName}($ids:[Int!]!,$data:${inputDataTypeName}!) {
                        ${methodName}(ids:$ids,data:$data){
                            ids
                        }
                    }
                `,
                variables: {
                    ids: parseInt(params.ids),
                    data: buildUploadData(
                        params.data,
                        inputDataTypeName,
                        introspectionResults,
                    ),
                },
                parseResponse: (response: any) => ({
                    data: response.data[methodName].ids,
                }),
            }
        case 'CREATE':
            methodName = `admin${resourceName}Create`
            inputDataTypeName=getDataParamName( `admin${resourceName}Create`,introspectionResults)
            return {
                query: gql`
                    mutation ${methodName}($data:${inputDataTypeName}!) {
                        ${methodName}(data:$data){
                        ${gqlGetFieldList(resourceName, introspectionResults)}
                    }
                    }
                `,
                variables: {
                    data: buildUploadData(
                        params.data,
                        inputDataTypeName,
                        introspectionResults,
                    ),
                },
                parseResponse: (response: any) => ({
                    data: response.data[methodName],
                }),
            }
        case 'DELETE':
            methodName = `admin${resourceName}Delete`
            return {
                query: gql`
                    mutation ${methodName}($id:Int!) {
                        ${methodName}(id:$id){
                         ${gqlGetFieldList(resourceName, introspectionResults)}
                         }
                    }
                `,
                variables: {
                    id: parseInt(params.id),
                },
                parseResponse: (response: any) => ({
                    data: response.data[methodName],
                }),
            }
        case 'DELETE_MANY':
            methodName = `admin${resourceName}DeleteMany`
            return {
                query: gql`
                    mutation ${methodName}($ids:[Int!]!) {
                        ${methodName}(ids:$ids){
                       ids
                        }
                    }
                `,
                variables: {
                    ids: params.ids.map((id:any)=>parseInt(id)),
                },
                parseResponse: (response: any) => ({
                    data: response.data[methodName].ids,
                }),
            }
    }
    /*
    const resource: any = introspectionResults.resource.find(
        r => r.type.name === resourceName,
    )*/

    return null
}

function getListParams(p: any) {
    const params = Object.assign({}, p)
    if (p.filter) {
        params.filter = []
        for (let k in p.filter) {
            if (k==='graphql_fields') continue
            if (p.filter[k]!=undefined)
                params.filter.push({
                    field: k,
                    value: `${p.filter[k]}`,
                })
        }
    } else {
        delete params.filter
    }
    return { params }
}

export async function buildObrigadoDataProvider(apiUrl:string,schema:any) {
    const apolloClient = new ApolloClient({
        link: createHttpLink({ uri: apiUrl , credentials:'include'}),
        cache: new InMemoryCache(),
        defaultOptions: {
            //@ts-ignore
            fetchPolicy: 'no-cache',
        },
    })
    let config:any={
        client: apolloClient,
        buildQuery,
    }
    if (schema){
        config.introspection= { schema }
    }
    let dataProvider=await buildGraphQLProvider(config)
    return convertFilesToBase64(dataProvider)
}
