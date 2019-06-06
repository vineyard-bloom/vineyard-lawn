import * as express from 'express';
import { HttpError } from './errors';
import { DeferredRequestTransform, Endpoint, LawnHandler, LawnRequest, Method, PromiseOrVoid, RequestListener, SimpleResponse } from './types';
export declare function logErrorToConsole(error: HttpError): void;
declare class DefaultRequestListener implements RequestListener {
    onRequest(request: LawnRequest<any>, response: SimpleResponse, res: any): PromiseOrVoid;
    onError(error: HttpError, request?: LawnRequest<any>): PromiseOrVoid;
}
export declare class EmptyRequestListener implements RequestListener {
    onRequest(request: LawnRequest<any>, response: SimpleResponse, res: any): PromiseOrVoid;
    onError(error: HttpError, request?: LawnRequest<any>): PromiseOrVoid;
}
export declare const defaultRequestListener: DefaultRequestListener;
export declare function createExpressHandler(endpoint: Endpoint): express.RequestHandler;
export declare function attachHandler(app: express.Application, endpoint: Endpoint, handler: any): void;
export declare const attachEndpoint: (app: express.Application) => (endpoint: Endpoint<any>) => void;
/**
 *
 * @param app  Express app object to attach the new endpoints
 *
 * @param endpoints  Array of endpoint definitions to create
 *
 */
export declare function createEndpoints(app: express.Application, endpoints: Endpoint[]): void;
export declare function wrapEndpoint<T>(requestTransform: DeferredRequestTransform<T>): (e: Endpoint) => Endpoint;
export declare function deferTransform<A, B>(transform: (t: A) => B): (t: A) => Promise<B>;
export declare const transformEndpoint: (overrides: Partial<Endpoint<any>>) => (endpoint: Endpoint<any>) => {
    method: Method;
    path: string;
    handler: LawnHandler<any>;
    middleware?: any[] | undefined;
    onResponse?: RequestListener | undefined;
    validation?: import("./types").Type<any> | undefined;
};
export declare type Transform<T> = (t: T) => T;
export declare type AsyncTransform<T> = (t: T) => Promise<T>;
export declare function pipe<T>(transforms: Transform<T>[]): Transform<T>;
export declare function pipeAsync<T>(transforms: AsyncTransform<T>[]): AsyncTransform<T>;
export declare const defineEndpoints: (requestTransform: DeferredRequestTransform<any>, endpoints: Endpoint<any>[]) => Endpoint<any>[];
export declare const setEndpointListener: (onResponse: RequestListener) => (endpoint: Endpoint<any>) => {
    method: Method;
    path: string;
    handler: LawnHandler<any>;
    middleware?: any[] | undefined;
    onResponse?: RequestListener | undefined;
    validation?: import("./types").Type<any> | undefined;
};
export {};
