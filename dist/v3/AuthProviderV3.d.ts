export declare class AuthProviderV3 {
    url: string;
    debug: boolean;
    constructor(url: string, debug?: boolean);
    login(params: any): Promise<string>;
    logout(): Promise<void>;
    checkAuth(): Promise<any>;
    checkError(error: any): Promise<void>;
    getPermissions(): Promise<any>;
}
