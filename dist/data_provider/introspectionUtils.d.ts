export declare function gqlGetMethod(typName: string, introspectionResults: any): any;
export declare function gqlGetType(typName: string, introspectionResults: any): any;
export declare function gqlGetFieldList(typName: string, introspectionResults: any, depth?: number): any;
export declare function getFieldTypeAndName(type: any): {
    type: string;
    typeName: string;
    itemType: string;
};
export declare function getDataParamName(methodName: string, introspectionResults: any): string;
export declare function checkForAlias(resourceName: string): string;
