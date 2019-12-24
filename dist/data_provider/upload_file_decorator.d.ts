/**
 * For posts update only, convert uploaded image in base 64 and attach it to
 * the `picture` sent property, with `src` and `title` attributes.
 */
export declare const convertFilesToBase64: (requestHandler: any) => (type: string, resource: any, params: any) => Promise<any>;
export declare function iterateDataAndReplaceFiles(data: any): Promise<void>;
