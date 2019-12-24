export declare class DataProviderV3 {
    introspection: any;
    url: string;
    constructor(url: string, introspection: any);
    getList(resourceName: string, params: any): Promise<any>;
    getOne(resourceName: string, params: any): Promise<{
        data: any;
    }>;
    getMany(resourceName: string, params: any): Promise<any>;
    getManyReference(resourceName: string, params: any): Promise<any>;
    update(resourceName: string, params: any): Promise<{
        data: any;
    }>;
    updateMany(resourceName: string, params: any): Promise<any>;
    create(resourceName: string, params: any): Promise<{
        data: any;
    }>;
    delete(resourceName: string, params: any): Promise<{
        data: any;
    }>;
    deleteMany(resourceName: string, params: any): Promise<{
        data: any;
    }>;
}
