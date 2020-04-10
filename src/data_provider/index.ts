
import gql from 'graphql-tag'


import {buildUploadData} from "./buildUploadData";
import {getDataParamName, gqlGetFieldList, checkForAlias} from "./introspectionUtils";
import {apiRequest} from "./api_request"

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
            methodName = `admin${checkForAlias(resourceName)}List`
            fieldList = ''
            if (params.filter &&
                params.filter.graphql_fields
            ) {
                fieldList =  params.filter.graphql_fields
            } else {
                fieldList = gqlGetFieldList(checkForAlias(resourceName), introspectionResults)
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
            methodName = `admin${checkForAlias(resourceName)}GetOne`
            return {
                query: gql`
                    query ${methodName}($id:String!) {
                        ${methodName}(id:$id){
                        ${gqlGetFieldList(checkForAlias(resourceName), introspectionResults)}
                    }
                    }
                `,
                variables: { id: `${params.id}` },
                parseResponse: (response: any) => ({
                    data: response.data[methodName],
                }),
            }
        case 'GET_MANY':
            methodName = `admin${checkForAlias(resourceName)}GetMany`
            return {
                query: gql`
                    query ${methodName}($ids:[Int!]!) {
                        ${methodName}(ids:$ids){
                        ${gqlGetFieldList(checkForAlias(resourceName), introspectionResults)}
                    }
                    }
                `,
                variables: { ids: params.ids },
                parseResponse: (response: any) => ({
                    data: response.data[methodName],
                }),
            }
        case 'GET_MANY_REFERENCE':
            methodName = `admin${checkForAlias(resourceName)}GetManyReference`
            fieldList = ''
            if (params.filter &&
                params.filter.graphql_fields
            ) {
                fieldList =  params.filter.graphql_fields
            } else {
                fieldList = gqlGetFieldList(checkForAlias(resourceName), introspectionResults)
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
            methodName = `admin${checkForAlias(resourceName)}Update`
            inputDataTypeName=getDataParamName(methodName,introspectionResults)
            //console.log('UPDATE', params.data)
            return {
                query: gql`
                    mutation ${methodName}($id:Int!,$data:${inputDataTypeName}!) {
                        ${methodName}(id:$id,data:$data){
                        ${gqlGetFieldList(checkForAlias(resourceName), introspectionResults)}
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
            methodName = `admin${checkForAlias(resourceName)}UpdateMany`
            inputDataTypeName=getDataParamName(methodName,introspectionResults)
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
            methodName = `admin${checkForAlias(resourceName)}Create`
            inputDataTypeName=getDataParamName( methodName,introspectionResults)
            return {
                query: gql`
                    mutation ${methodName}($data:${inputDataTypeName}!) {
                        ${methodName}(data:$data){
                        ${gqlGetFieldList(checkForAlias(resourceName), introspectionResults)}
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
            methodName = `admin${checkForAlias(resourceName)}Delete`
            return {
                query: gql`
                    mutation ${methodName}($id:Int!) {
                        ${methodName}(id:$id){
                         ${gqlGetFieldList(checkForAlias(resourceName), introspectionResults)}
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
            methodName = `admin${checkForAlias(resourceName)}DeleteMany`
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

    let introspectionResult = {
        types: [],
        queries: []
    };

    const data = await apiRequest(
        apiUrl,
        gql`
      query IntrospectionQuery {
        __schema {
          queryType {
            name
          }
          mutationType {
            name
          }
          subscriptionType {
            name
          }
          types {
            ...FullType
          }
          directives {
            name
            description
            locations
            args {
              ...InputValue
            }
          }
        }
      }

      fragment FullType on __Type {
        kind
        name
        description
        fields(includeDeprecated: true) {
          name
          description
          args {
            ...InputValue
          }
          type {
            ...TypeRef
          }
          isDeprecated
          deprecationReason
        }
        inputFields {
          ...InputValue
        }
        interfaces {
          ...TypeRef
        }
        enumValues(includeDeprecated: true) {
          name
          description
          isDeprecated
          deprecationReason
        }
        possibleTypes {
          ...TypeRef
        }
      }

      fragment InputValue on __InputValue {
        name
        description
        type {
          ...TypeRef
        }
        defaultValue
      }

      fragment TypeRef on __Type {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                  ofType {
                    kind
                    name
                    ofType {
                      kind
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
        {}
    )
    let introspection_data = data.data.__schema

    let query = introspection_data.types.filter( (t:any) => t.name == 'Query')[0].fields
    let mutation = introspection_data.types.filter( (t:any) => t.name == 'Mutation')[0].fields
    let queries = query.concat(mutation);
    introspectionResult.queries = queries;
    introspectionResult.types=data.data.__schema.types;
    //let dataProvider=await buildGraphQLProvider(config)
    return buildQuery(introspectionResult)
}
