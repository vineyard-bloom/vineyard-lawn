import * as express from 'express';
import { HttpError } from './errors';
import { DeferredRequestTransform, Endpoint, LawnHandler, LawnRequest, Method, PromiseOrVoid, RequestListener, SimpleResponse } from './types';
export declare function logErrorToConsole(error: HttpError): void;
export declare class EmptyRequestListener implements RequestListener {
    onRequest(request: LawnRequest, response: SimpleResponse, res: any): PromiseOrVoid;
    onError(error: HttpError, request?: LawnRequest): PromiseOrVoid;
}
export declare function createExpressHandler(endpoint: Endpoint): express.RequestHandler;
export declare function attachHandler(app: express.Application, endpoint: Endpoint, handler: any): void;
export declare const attachEndpoint: (app: express.Application) => (endpoint: Endpoint) => void;
/**
 *
 * @param app  Express app object to attach the new endpoints
 *
 * @param endpoints  Array of endpoint definitions to create
 *
 */
export declare function createEndpoints(app: express.Application, endpoints: Endpoint[]): void;
/**
 *
 * @param requestTransform  A function to be run before the handler
 *
 */
export declare const wrapEndpoint: (requestTransform: DeferredRequestTransform) => (endpoint: Endpoint) => {
    handler: LawnHandler;
    method: Method;
    path: string;
    middleware?: any[] | undefined;
    onResponse?: RequestListener | undefined;
    validation?: any;
};
export declare function deferTransform<A, B>(transform: (t: A) => B): (t: A) => Promise<B>;
export declare const transformEndpoint: (overrides: Partial<Endpoint>) => (endpoint: Endpoint) => {
    overrides: Partial<Endpoint>;
    method: Method;
    path: string;
    handler: LawnHandler;
    middleware?: any[] | undefined;
    onResponse?: RequestListener | undefined;
    validation?: any;
};
export declare type Transform<T> = (t: T) => T;
export declare type AsyncTransform<T> = (t: T) => Promise<T>;
export declare function pipe<T>(transforms: Transform<T>[]): Transform<T>;
export declare function pipeAsync<T>(transforms: AsyncTransform<T>[]): AsyncTransform<T>;
export declare const defineEndpoints: (requestTransform: DeferredRequestTransform, endpoints: Endpoint[]) => {
    handler: LawnHandler;
    method: Method;
    path: string;
    middleware?: any[] | undefined;
    onResponse?: RequestListener | undefined;
    validation?: any;
}[];
export declare function setEndpointListener(onResponse: RequestListener): (endpoint: Endpoint) => {
    overrides: Partial<Endpoint>;
    method: Method;
    path: string;
    handler: LawnHandler;
    middleware?: any[] | undefined;
    onResponse?: RequestListener | undefined;
    validation?: any;
};
