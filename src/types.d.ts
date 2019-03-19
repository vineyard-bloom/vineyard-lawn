import { Version } from "./versioning";
import * as express from "express";
export declare enum Method {
    get = 0,
    patch = 1,
    post = 2,
    put = 3,
    delete = 4
}
export interface LawnRequest {
    data: any;
    session: any;
    user?: any;
    params?: any;
    version?: Version;
    startTime?: any;
    original: express.Request;
}
export declare type PromiseOrVoid = Promise<void> | void;
export declare type DeferredRequestTransform = (request: LawnRequest) => Promise<LawnRequest>;
export declare type RequestTransform = (request: LawnRequest) => LawnRequest;
export declare type LawnHandler = (request: LawnRequest) => Promise<any>;
export interface SimpleResponse {
    code: number;
    message: string;
    body: any;
}
export interface RequestListener {
    onRequest(request: LawnRequest, response: SimpleResponse, req: any): PromiseOrVoid;
    onError(error: Error, request?: LawnRequest): PromiseOrVoid;
}
export interface Endpoint {
    /** HTTP Method */
    method: Method;
    /** Relative endpoint path */
    path: string;
    /** Request handler function */
    handler: LawnHandler;
    /** Array of Express middleware to use just for this endpoint */
    middleware?: any[];
    /** Optional callback that is fired when the endpoint sends a response */
    onResponse?: RequestListener;
    /** Optional placeholder for validation data.  Not directly used by Lawn but available for third-party request transforms. */
    validation?: any;
}
