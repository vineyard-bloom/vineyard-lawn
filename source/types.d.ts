export declare type PromiseOrVoid = Promise<any> | void;
import { Version } from "./version";
import { ValidateFunction } from "ajv";
export declare enum Method {
    get = 0,
    post = 1,
    put = 2,
    delete = 3,
}
export interface Request {
    data: any;
    session: any;
    user?: any;
    params?: any;
    version?: Version | undefined;
    startTime?: any;
    original?: any;
}
export declare type Filter = (request: Request) => Promise_Or_Void;
export declare type Promise_Or_Void = Promise<void> | void;
export declare type Request_Processor = (request: Request) => Promise<Request>;
export declare type Response_Generator = (request: Request) => Promise<any>;
export interface SimpleResponse {
    code: number;
    message: string;
    body: any;
}
export interface RequestListener {
    onRequest(request: Request, response: SimpleResponse, req: any): PromiseOrVoid;
    onError(error: Error, request?: Request): PromiseOrVoid;
}
export interface ValidationCompiler {
    compileApiSchema(schema: any): any;
}
export interface Endpoint_Info {
    method: Method;
    path: string;
    action: Response_Generator;
    middleware?: any[];
    filter?: Filter;
    validator?: ValidateFunction;
}
export interface Optional_Endpoint_Info {
    method?: Method;
    path?: string;
    action?: Response_Generator;
    middleware?: any[];
    filter?: Filter;
}
