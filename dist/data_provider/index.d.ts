export interface ObjectLiteral {
    [key: string]: any;
}
export interface DataQuery {
    query: any;
    variables?: ObjectLiteral;
    parseResponse?: (response: any) => any;
}
export declare function buildObrigadoDataProvider(apiUrl: string, schema: any): Promise<(type: string, resource: any, params: any) => Promise<any>>;
