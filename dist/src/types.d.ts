import { Version } from "./versioning";
import * as express from "express";
export declare enum Method {
    get = 0,
    patch = 1,
    post = 2,
    put = 3,
    delete = 4
}
export interface LawnRequest<T> {
    data: T;
    params?: any;
    version?: Version;
    startTime?: any;
    original: express.Request;
}
export declare type PromiseOrVoid = Promise<void> | void;
export declare type DeferredRequestTransform<T> = (request: LawnRequest<T>) => Promise<LawnRequest<T>>;
export declare type RequestTransform<T> = (request: LawnRequest<T>) => LawnRequest<T>;
export declare type LawnHandler<T> = (request: LawnRequest<T>) => Promise<any>;
export interface SimpleResponse {
    code: number;
    message: string;
    body: any;
}
export interface RequestListener {
    onRequest(request: LawnRequest<any>, response: SimpleResponse, req: any): PromiseOrVoid;
    onError(error: Error, request?: LawnRequest<any>): PromiseOrVoid;
}
export declare type Type<T> = new (...args: any[]) => T;
export interface Endpoint<T = any> {
    /** HTTP Method */
    method: Method;
    /** Relative endpoint path */
    path: string;
    /** Request handler function */
    handler: LawnHandler<T>;
    /** Array of Express middleware to use just for this endpoint */
    middleware?: any[];
    /** Optional callback that is fired when the endpoint sends a response */
    onResponse?: RequestListener;
    /** Optional placeholder for validation data.  Not directly used by Lawn but available for third-party request transforms. */
    validation?: Type<T>;
}
