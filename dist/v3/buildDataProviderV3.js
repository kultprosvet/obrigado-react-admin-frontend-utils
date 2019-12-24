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
const api_request_1 = require("../data_provider/api_request");
const graphql_tag_1 = require("graphql-tag");
const DataProviderV3_1 = require("./DataProviderV3");
function buildDataProviderV3(url) {
    return __awaiter(this, void 0, void 0, function* () {
        let introspectionResult = {
            types: [],
            queries: []
        };
        const data = yield api_request_1.apiRequest(url, graphql_tag_1.default `
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
    `, {});
        let introspection_data = data.data.__schema;
        let query = introspection_data.types.filter((t) => t.name == 'Query')[0].fields;
        let mutation = introspection_data.types.filter((t) => t.name == 'Mutation')[0].fields;
        let queries = query.concat(mutation);
        introspectionResult.queries = queries;
        introspectionResult.types = data.data.__schema.types;
        return new DataProviderV3_1.DataProviderV3(url, introspectionResult);
    });
}
exports.buildDataProviderV3 = buildDataProviderV3;
//# sourceMappingURL=buildDataProviderV3.js.map