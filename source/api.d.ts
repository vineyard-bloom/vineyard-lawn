/// <reference types="es6-promise" />
/// <reference types="express" />
import * as express from "express";
export * from './errors';
export declare enum Method {
    get = 0,
    post = 1,
}
export declare type Promise_Or_Void = Promise<void> | void;
export declare type Response_Generator = (request: Request) => Promise<any>;
export declare type Filter = (request: Request) => Promise_Or_Void;
export interface Endpoint_Info {
    method: Method;
    path: string;
    action: Response_Generator;
    middleware?: any[];
    filter?: Filter;
}
export interface Optional_Endpoint_Info {
    method?: Method;
    path?: string;
    action?: Response_Generator;
    middleware?: any[];
    filter?: Filter;
}
export declare function handle_error(res: any, error: any): void;
export declare function create_handler(endpoint: Endpoint_Info): (req: any, res: any) => void;
export declare function attach_handler(app: express.Application, endpoint: Endpoint_Info, handler: any): void;
export declare function create_endpoint(app: express.Application, endpoint: Endpoint_Info): void;
export declare function create_endpoint_with_defaults(app: express.Application, endpoint_defaults: Optional_Endpoint_Info, endpoint: Optional_Endpoint_Info): void;
export declare function create_endpoints(app: express.Application, endpoints: Endpoint_Info[]): void;
