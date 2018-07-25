import { Version } from "./version";
import { ValidateFunction } from "ajv";
export declare enum Method {
    get = 0,
    patch = 1,
    post = 2,
    put = 3,
    delete = 4
}
export interface Request {
    data: any;
    session: any;
    user?: any;
    params?: any;
    version?: Version;
    startTime?: any;
    original?: any;
}
export declare type PromiseOrVoid = Promise<void> | void;
export declare type RequestProcessor = (request: Request) => Promise<Request>;
export declare type ResponseGenerator = (request: Request) => Promise<any>;
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
export interface EndpointInfo {
    /** HTTP Method */
    method: Method;
    /** Relative endpoint path */
    path: string;
    /** Request handler function */
    action: ResponseGenerator;
    /** Array of Express middleware to use just for this endpoint */
    middleware?: any[];
    /** AJV schema validator function */
    validator?: ValidateFunction;
}
