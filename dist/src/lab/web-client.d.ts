export declare class WebClient {
    url: string;
    constructor(url: string);
    private request;
    get(path: string, params?: any): Promise<any>;
    post(path: string, data?: any): Promise<any>;
    put(path: string, data: any): Promise<any>;
    patch(path: string, data: any): Promise<any>;
    delete(path: string): Promise<any>;
}
