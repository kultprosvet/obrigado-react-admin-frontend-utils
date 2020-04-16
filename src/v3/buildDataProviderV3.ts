import {apiRequest} from "../data_provider/api_request";
import gql from "graphql-tag";
import {DataProviderV3} from "./DataProviderV3";
export type GQLField=string | {name:string,fields:Array<GQLField>}
type ResourceConfig=Partial<{
    getList:Array<GQLField>
    getOne:Array<GQLField>
    getMany:Array<GQLField>
    getManyReference:Array<GQLField>
    update:Array<GQLField>
    create:Array<GQLField>
    delete:Array<GQLField>
    [k:string]:Array<GQLField>
}> & { defaultScanLevel?:number}
export type ProviderConfig={
    [key:string]:ResourceConfig
} & { defaultScanLevel?:number}
export async function buildDataProviderV3(url: string,config?:ProviderConfig): Promise<DataProviderV3> {


    let introspectionResult = {
        types: [],
        queries: []
    };

    const data = await apiRequest(
        url,
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
    DataProviderV3.introspection=introspectionResult
    DataProviderV3.url=url
    DataProviderV3.config=config
    return new DataProviderV3();
}
