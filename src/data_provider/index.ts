import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'

import gql from 'graphql-tag'
import {convertFilesToBase64} from "./upload_file_decorator";
//@ts-ignore
import buildGraphQLProvider from 'ra-data-graphql'
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
    switch (raFetchType) {
        case 'GET_LIST':
            methodName = `admin${resourceName}List`
            let fieldList = ''
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
        case 'UPDATE':
            methodName = `admin${resourceName}Update`
            console.log('UPDATE', params.data)
            return {
                query: gql`
                    mutation ${methodName}($id:Int!,$data:${resourceName}Input!) {
                        ${methodName}(id:$id,data:$data){
                        ${gqlGetFieldList(resourceName, introspectionResults)}
                    }
                    }
                `,
                variables: {
                    id: parseInt(params.id),
                    data: buildUploadData(
                        params.data,
                        `${resourceName}Input`,
                        introspectionResults,
                    ),
                },
                parseResponse: (response: any) => {
                    console.log('RESPOMSE', response)
                    return {
                        data: response.data[methodName],
                    }
                },
            }
        case 'UPDATE_MANY':
            methodName = `admin${resourceName}UpdateMany`
            return {
                query: gql`
                    mutation ${methodName}($ids:[Int!]!,$data:${resourceName}Input!) {
                        ${methodName}(ids:$ids,data:$data){
                            ids
                        }
                    }
                `,
                variables: {
                    ids: parseInt(params.ids),
                    data: buildUploadData(
                        params.data,
                        `${resourceName}Input`,
                        introspectionResults,
                    ),
                },
                parseResponse: (response: any) => ({
                    data: response.data[methodName].ids,
                }),
            }
        case 'CREATE':
            methodName = `admin${resourceName}Create`
            return {
                query: gql`
                    mutation ${methodName}($data:${resourceName}Input!) {
                        ${methodName}(data:$data){
                        ${gqlGetFieldList(resourceName, introspectionResults)}
                    }
                    }
                `,
                variables: {
                    data: buildUploadData(
                        params.data,
                        `${resourceName}Input`,
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
                    ids: parseInt(params.ids),
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


export function gqlGetType(typName: string, introspectionResults: any) {
    for (let type of introspectionResults.types) {
        if (type.name === typName) {
            return type
        }
    }
    return null
}
export function gqlGetFieldList(
    typName: string,
    introspectionResults: any,
    depth: number = 2,
) {
    //  console.log('gqlGetFieldList', typName, depth)
    for (let type of introspectionResults.types) {
        if (type.name === typName) {
            let fields = type.fields.map((item: any) => {
                let typeInfo = getFieldTypeAndName(item.type)
                //console.log('FIELD', typName, item, typeInfo, depth)
                if (
                    depth == 1 &&
                    (typeInfo.type === 'OBJECT' ||
                        typeInfo.itemType === 'OBJECT')
                )
                    return ''
                if (
                    typeInfo.type === 'LIST' &&
                    typeInfo.itemType === 'OBJECT'
                ) {
                    return `${item.name} {${gqlGetFieldList(
                        typeInfo.typeName,
                        introspectionResults,
                        depth - 1,
                    )}}`
                } else if (typeInfo.type === 'OBJECT') {
                    return `${item.name} {${gqlGetFieldList(
                        typeInfo.typeName,
                        introspectionResults,
                        depth - 1,
                    )}}`
                } else {
                    return item.name
                }
            })
            return fields.join(',')
        }
    }
    return ''
}
function getFieldTypeAndName(
    type: any,
): { type: string; typeName: string; itemType: string } {
    if (type.kind === 'NON_NULL') {
        return getFieldTypeAndName(type.ofType)
    }
    if (type.kind === 'LIST') {
        let types = getFieldTypeAndName(type.ofType)
        return {
            type: 'LIST',
            itemType: types.type,
            typeName: types.typeName,
        }
    }
    if (type.kind === 'OBJECT') {
        return {
            type: 'OBJECT',
            itemType: 'OBJECT',
            typeName: type.name,
        }
    }
    return {
        type: 'SCALAR',
        itemType: 'SCALAR',
        typeName: type.name,
    }
}
function buildUploadData(
    data: any,
    inputTypeName: string,
    introspectionResults: any,
) {
    if (!data) return null
    let type = gqlGetType(inputTypeName, introspectionResults)
    let out: ObjectLiteral = {}
    for (let f of type.inputFields) {
        // console.log('UPD DATA F', f, 'data', data)
        if (
            f.type.kind == 'SCALAR' ||
            (f.type.kind == 'NON_NULL' && f.type.ofType.kind === 'SCALAR')
        ) {
            out[f.name] = data[f.name]
        } else if (
            f.type.kind == 'INPUT_OBJECT' ||
            (f.type.kind == 'NON_NULL' && f.type.ofType.kind === 'INPUT_OBJECT')
        ) {
            // console.log('UPD DATA O', f, 'data', data)
            out[f.name] = buildUploadData(
                data[f.name],
                f.type.name,
                introspectionResults,
            )
        } else if (f.type.ofType.kind === 'LIST') {
            if (f.type.ofType.ofType.ofType.kind !== 'SCALAR') {
                let listItemType = f.type.ofType.ofType.ofType.name
                //  console.log(listItemType, f)

                out[f.name] = []
                for (let item of data[f.name]) {
                    out[f.name].push(
                        buildUploadData(
                            item,
                            listItemType,
                            introspectionResults,
                        ),
                    )
                }
            } else {
                out[f.name] = data[f.name]
            }
        }
    }
    //console.log('UPD DATA', out)
    return out
}

function getListParams(p: any) {
    const params = Object.assign({}, p)
    if (p.filter) {
        params.filter = []
        for (let k in p.filter) {
            if (k==='graphql_fields') continue
            if (p.filter[k])
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