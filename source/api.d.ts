import * as express from "express";
export * from './errors';
export declare enum Method {
    get = 0,
    post = 1,
}
export declare type Response_Generator = (args: any) => any;
export interface Endpoint_Info {
    method: Method;
    path: string;
    action: Response_Generator;
    middleware?: any[];
}
export declare function handle_error(res: any, error: any): void;
export declare function create_handler(endpoint: Endpoint_Info): (req: any, res: any) => void;
export declare function attach_handler(app: express.Application, endpoint: Endpoint_Info, handler: any): void;
export declare function initialize_endpoints(app: express.Application, endpoints: Endpoint_Info[]): void;
