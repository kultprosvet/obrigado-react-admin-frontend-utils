export interface ObjectLiteral {
    [key: string]: any;
}
export interface DataQuery {
    query: any;
    variables?: ObjectLiteral;
    parseResponse?: (response: any) => any;
}
export declare function gqlGetType(typName: string, introspectionResults: any): any;
export declare function gqlGetFieldList(typName: string, introspectionResults: any, depth?: number): any;
export declare function buildObrigadoDataProvider(apiUrl: string, schema: any): Promise<(type: string, resource: any, params: any) => Promise<any>>;
