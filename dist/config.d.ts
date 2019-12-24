declare const config: {
    init(url: string): void;
    getAPI(): string;
    getRolesList(): Promise<any>;
};
export default config;
