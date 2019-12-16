import gql from "graphql-tag";
import {buildUploadData, gqlGetFieldList} from "..";
import {getDataParamName} from "../data_provider/introspectionUtils";
import {apiRequest} from "../data_provider/api_request";
import { iterateDataAndReplaceFiles } from "../data_provider/upload_file_decorator";

export class DataProviderV3 {
  introspection: any;
  url:string;
  constructor(url:string,introspection: any) {
    this.url=url;
    this.introspection = introspection;
    console.log('introspection', introspection);
  }

  async getList(resourceName:string, params:any) {
    let methodName = `admin${resourceName}List`;
    let fieldList = '';
    if (params.filter &&
        params.filter.graphql_fields
    ) {
      fieldList =  params.filter.graphql_fields
    } else {
      fieldList = gqlGetFieldList(resourceName, this.introspection)
    }
    let query = gql`
                    query ${methodName}($params:ReactAdminListParams!) {
                        ${methodName}(params:$params){
                            data{${fieldList}}
                            total
                        }
                    }
                `
    let variables = getListParams(params);
    const response = await apiRequest(this.url, query, variables);
    console.log('getList fired:', methodName, response.data[methodName])
    return response.data[methodName]
  }

  async getOne(resourceName:string, params:any) {
    let methodName = `admin${resourceName}GetOne`
    let query = gql`
                    query ${methodName}($id:String!) {
                        ${methodName}(id:$id){
                        ${gqlGetFieldList(resourceName, this.introspection)}
                    }
                    }
                `
    let variables = { id: `${params.id}` };
    const response = await apiRequest(this.url, query, variables);
    console.log('getOne fired:', methodName, {data: response.data[methodName]})
    return {
      data: response.data[methodName]
    }
  }

  async getMany(resourceName:string, params:any) {
    let methodName = `admin${resourceName}GetMany`
    let query = gql`
                    query ${methodName}($ids:[Int!]!) {
                        ${methodName}(ids:$ids){
                        ${gqlGetFieldList(resourceName, this.introspection)}
                    }
                    }
                `;
    let variables = {ids: params.ids};
    const response = await apiRequest(this.url, query, variables);
    console.log('getMany fired:', methodName, response.data[methodName])
    return response.data[methodName];
  }

  async getManyReference(resourceName:string, params:any) {
    console.log('getManyReference params', params)
    let methodName = `admin${resourceName}GetManyReference`
    let fieldList = ''
    if (params.filter &&
        params.filter.graphql_fields
    ) {
      fieldList =  params.filter.graphql_fields
    } else {
      fieldList = gqlGetFieldList(resourceName, this.introspection)
    }
    let query = gql`
                    query ${methodName}($params:ReactAdminGetManyReferenceParams!) {
                        ${methodName}(params:$params){
                            data{${fieldList}}
                            total
                        }
                    }
                `
    let variables = getListParams(params);
    const response = await apiRequest(this.url, query, variables);
    console.log('getManyReference fired:', methodName, response.data[methodName])
    return response.data[methodName];
  }

  async update(resourceName:string, params:any) {
    let methodName = `admin${resourceName}Update`
    let inputDataTypeName=getDataParamName(`admin${resourceName}Update`, this.introspection)
    let data=params.data
    await iterateDataAndReplaceFiles(data)
    let query = gql`
                    mutation ${methodName}($id:Int!,$data:${inputDataTypeName}!) {
                        ${methodName}(id:$id,data:$data){
                        ${gqlGetFieldList(resourceName, this.introspection)}
                    }
                    }
                `
    let variables = {
      id: parseInt(params.id),
      data: buildUploadData(
          data,
          inputDataTypeName,
          this.introspection,
      )
    }
    console.log('update variables', variables)
    const response = await apiRequest(this.url, query, variables);
    console.log('update fired:', methodName, {data: response.data[methodName]})
    return {
      data: response.data[methodName]
    };
  }

  async updateMany(resourceName:string, params:any) {
    console.log('updateMany fired')
    let methodName = `admin${resourceName}UpdateMany`
    let inputDataTypeName = getDataParamName(`admin${resourceName}UpdateMany`, this.introspection)
    let data=params.data
    await iterateDataAndReplaceFiles(data)
    let query = gql`
                    mutation ${methodName}($ids:[Int!]!,$data:${inputDataTypeName}!) {
                        ${methodName}(ids:$ids,data:$data){
                            ids
                        }
                    }
                `
    let variables = {
      ids: parseInt(params.ids),
      data: buildUploadData(
          data,
          inputDataTypeName,
          this.introspection,
      )
    }
    const response = await apiRequest(this.url, query, variables);
    console.log('updateMany fired: ', methodName, response.data[methodName])
    return response.data[methodName]
  }

  async create(resourceName:string, params:any) {
    console.log('create fired')
    let methodName = `admin${resourceName}Create`
    let inputDataTypeName=getDataParamName( `admin${resourceName}Create`, this.introspection)
    let data=params.data
    await iterateDataAndReplaceFiles(data)
    let query = gql`
                    mutation ${methodName}($data:${inputDataTypeName}!) {
                        ${methodName}(data:$data){
                        ${gqlGetFieldList(resourceName, this.introspection)}
                    }
                    }
                `
    let variables = {
      data: buildUploadData(
          data,
          inputDataTypeName,
          this.introspection,
      ),
    }
    const response = await apiRequest(this.url, query, variables)
    console.log('create fired: ', methodName, {data: response.data[methodName]})
    return {
      data: response.data[methodName]
    }
  }

  async delete(resourceName:string, params:any) {
    let methodName = `admin${resourceName}Delete`
    let query = gql`
                    mutation ${methodName}($id:Int!) {
                        ${methodName}(id:$id){
                         ${gqlGetFieldList(resourceName, this.introspection)}
                         }
                    }
                `
    let variables = {id: parseInt(params.id)}
    const response = await apiRequest(this.url, query, variables)
    console.log('delete fired:', methodName, {data: response.data[methodName]})
    return {
      data: response.data[methodName]};
  }

  async deleteMany(resourceName:string, params:any) {
    let methodName = `admin${resourceName}DeleteMany`
    let query = gql`
                    mutation ${methodName}($ids:[Int!]!) {
                        ${methodName}(ids:$ids){
                       ids
                        }
                    }
                `
    let variables = { ids: params.ids.map((id:any)=>parseInt(id)) }
    let response = await apiRequest(this.url, query, variables)
    console.log('deleteMany fired:', methodName, { data: response.data[methodName] })
    return {
      data: response.data[methodName]
    }
  }
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

