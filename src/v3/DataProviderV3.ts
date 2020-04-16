import gql from "graphql-tag";
import {buildUploadData, GQLField, gqlGetFieldList, ProviderConfig} from ".."
import {getDataParamName} from "../data_provider/introspectionUtils";
import {apiRequest} from "../data_provider/api_request";
import { iterateDataAndReplaceFiles } from "../data_provider/upload_file_decorator";
import { checkForAlias } from "../data_provider/introspectionUtils";

export class DataProviderV3 {
  static introspection: any;
  static url:string;
  static config?:ProviderConfig
  constructor() {

   // console.log('introspectio n', DataProviderV3.introspection);
  }
  async getList(resourceName:string, params:any) {
   // console.log('get list',this,resourceName,params)
    let methodName = `admin${checkForAlias(resourceName)}List`;
    let fieldList = '';
    if (params.filter &&
        params.filter.graphql_fields
    ) {
      fieldList =  params.filter.graphql_fields
    } else {
      fieldList = this.getFieldList(resourceName,'getList')
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
    const response = await apiRequest(DataProviderV3.url, query, variables);
    console.log('getList fired:', methodName, response.data[methodName])
    return response.data[methodName]
  }

  async getOne(resourceName:string, params:any) {
  //  console.log('get one')
    let methodName = `admin${checkForAlias(resourceName)}GetOne`
    let query = gql`
                    query ${methodName}($id:String!) {
                        ${methodName}(id:$id){
                        ${ this.getFieldList(resourceName,'getOne')}
                    }
                    }
                `
    let variables = { id: `${params.id}` };
    const response = await apiRequest(DataProviderV3.url, query, variables);
    console.log('getOne fired:', methodName, {data: response.data[methodName]})
    return {
      data: response.data[methodName]
    }
  }

  async getMany(resourceName:string, params:any) {
    //console.log('get many')
    let methodName = `admin${checkForAlias(resourceName)}GetMany`
    let query = gql`
                    query ${methodName}($ids:[Int!]!) {
                        ${methodName}(ids:$ids){
                        ${ this.getFieldList(resourceName,'getMany')}
                    }
                    }
                `;
    let variables = {ids: params.ids};
    const response = await apiRequest(DataProviderV3.url, query, variables);
    console.log('getMany fired:', methodName, response.data[methodName])
    return {data:response.data[methodName]};
  }

  async getManyReference(resourceName:string, params:any) {
 //   console.log('getManyReference params', params)
    let methodName = `admin${checkForAlias(resourceName)}GetManyReference`
    let fieldList = ''
    if (params.filter &&
        params.filter.graphql_fields
    ) {
      fieldList = params.filter.graphql_fields
    } else {
      fieldList =  this.getFieldList(resourceName,'getManyReference')
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
    const response = await apiRequest(DataProviderV3.url, query, variables);
    console.log('getManyReference fired:', methodName, response.data[methodName])
    return response.data[methodName];
  }

  async update(resourceName:string, params:any) {
    let methodName = `admin${checkForAlias(resourceName)}Update`
    let inputDataTypeName = getDataParamName(methodName, DataProviderV3.introspection)
    let data = params.data
    await iterateDataAndReplaceFiles(data)
    let query = gql`
                    mutation ${methodName}($id:Int!,$data:${inputDataTypeName}!) {
                        ${methodName}(id:$id,data:$data){
                        ${this.getFieldList(resourceName,'update')}
                    }
                    }
                `
    let variables = {
      id: parseInt(params.id),
      data: buildUploadData(
          data,
          inputDataTypeName,
          DataProviderV3.introspection,
      )
    }
    console.log('update variables', variables)
    const response = await apiRequest(DataProviderV3.url, query, variables);
    console.log('update fired:', methodName, {data: response.data[methodName]})
    return {
      data: response.data[methodName]
    };
  }

  async updateMany(resourceName:string, params:any) {
  //  console.log('updateMany fired')
    let methodName = `admin${checkForAlias(resourceName)}UpdateMany`
    let inputDataTypeName = getDataParamName(methodName, DataProviderV3.introspection)
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
          DataProviderV3.introspection,
      )
    }
    const response = await apiRequest(DataProviderV3.url, query, variables);
    console.log('updateMany fired: ', methodName, response.data[methodName])
    return response.data[methodName]
  }

  async create(resourceName:string, params:any) {
   // console.log('create fired')
    let methodName = `admin${checkForAlias(resourceName)}Create`
    let inputDataTypeName = getDataParamName(methodName, DataProviderV3.introspection)
    let data=params.data
    await iterateDataAndReplaceFiles(data)
    let query = gql`
                    mutation ${methodName}($data:${inputDataTypeName}!) {
                        ${methodName}(data:$data){
                         ${this.getFieldList(resourceName,'create')}
                    }
                    }
                `
    let variables = {
      data: buildUploadData(
          data,
          inputDataTypeName,
          DataProviderV3.introspection,
      ),
    }
    const response = await apiRequest(DataProviderV3.url, query, variables)
    console.log('create fired: ', methodName, {data: response.data[methodName]})
    return {
      data: response.data[methodName]
    }
  }

  async delete(resourceName:string, params:any) {
    let methodName = `admin${checkForAlias(resourceName)}Delete`
    let query = gql`
                    mutation ${methodName}($id:Int!) {
                        ${methodName}(id:$id){
                         ${this.getFieldList(resourceName,'delete')}
                         }
                    }
                `
    let variables = {id: parseInt(params.id)}
    const response = await apiRequest(DataProviderV3.url, query, variables)
    console.log('delete fired:', methodName, {data: response.data[methodName]})
    return {
      data: response.data[methodName]};
  }

  async deleteMany(resourceName:string, params:any) {
    let methodName = `admin${checkForAlias(resourceName)}DeleteMany`
    let query = gql`
                    mutation ${methodName}($ids:[Int!]!) {
                        ${methodName}(ids:$ids){
                       ids
                        }
                    }
                `
    let variables = { ids: params.ids.map((id:any)=>parseInt(id)) }
    let response = await apiRequest(DataProviderV3.url, query, variables)
    console.log('deleteMany fired:', methodName, { data: response.data[methodName] })
    return {
      data: response.data[methodName]
    }
  }

  getFieldList(resourceName: string, method: string): string {
    if (!DataProviderV3.config ){
      return gqlGetFieldList(checkForAlias(resourceName), DataProviderV3.introspection)
    }
    if (DataProviderV3.config.defaultScanLevel && !DataProviderV3.config[resourceName]){
      return gqlGetFieldList(checkForAlias(resourceName), DataProviderV3.introspection,DataProviderV3.config.defaultScanLevel)
    }
    if (!DataProviderV3.config[resourceName]){
      return gqlGetFieldList(checkForAlias(resourceName), DataProviderV3.introspection)
    }
    const config = DataProviderV3.config[resourceName]
    if (!config[method]){
      if (config.defaultScanLevel){
        return gqlGetFieldList(checkForAlias(resourceName), DataProviderV3.introspection,config.defaultScanLevel)
      }else {
        return gqlGetFieldList(checkForAlias(resourceName), DataProviderV3.introspection)
      }
    }
    if (config[method] ){
      return this.buildFields(config[method] as GQLField[])
    }
    return gqlGetFieldList(checkForAlias(resourceName), DataProviderV3.introspection)

  }
  buildFields(fields:GQLField[]){
    let out=''
    for(const item of fields){
      if (typeof item=='string'){
        if (out==''){
          out=item
        }else {
          out=out+','+item
        }
      }else{
        if (out==''){
          out=`${item.name} {${this.buildFields(item.fields)}}`
        }else {
          out=out+`,${item.name} {${this.buildFields(item.fields)}}`
        }
      }

    }
    return  out
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
