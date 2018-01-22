export declare class WebClient {
    url: string;
    jar: any;
    constructor(url: string);
    private request(method, path, params, data);
    get(path: string, params?: any): any;
    post(path: string, data?: any): any;
    put(path: string, data: any): any;
    patch(path: string, data: any): any;
}
