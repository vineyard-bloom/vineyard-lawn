/// <reference types="express" />
/// <reference types="node" />
import * as express from "express";
export declare enum Method {
    get = 0,
    post = 1,
}
export declare type Response_Generator = (request: express.Request) => Promise<any>;
export interface Endpoint_Info {
    method: Method;
    action: Response_Generator;
}
export declare class HTTP_Error extends Error {
    status: number;
    constructor(message?: string, status?: number);
}
export declare class Bad_Request extends HTTP_Error {
    constructor(message?: string);
}
export declare class Needs_Login extends HTTP_Error {
    constructor(message?: string);
}
export declare class Unauthorized extends HTTP_Error {
    constructor(message?: string);
}
export declare function handle_error(res: any, error: any): void;
export declare function create_handler(endpoint: Endpoint_Info): (req: any, res: any) => void;
export declare function attach_handler(app: express.Application, method: Method, route: string, handler: any): void;
export declare function initialize_endpoints(app: express.Application, endpoints: {
    [route: string]: Endpoint_Info;
}): void;
