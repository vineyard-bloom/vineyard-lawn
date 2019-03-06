import * as express from 'express';
import { HttpError } from './errors';
import { EndpointInfo, LawnHandler, Method, RequestListener, RequestTransform } from './types';
export declare function logErrorToConsole(error: HttpError): void;
export declare function createExpressHandler(endpoint: EndpointInfo): express.RequestHandler;
export declare function attachHandler(app: express.Application, endpoint: EndpointInfo, handler: any): void;
export declare const createEndpoint: (app: express.Application) => (endpoint: EndpointInfo) => void;
/**
 *
 * @param app  Express app object to attach the new endpoints
 *
 * @param endpoints  Array of endpoint definitions to create
 *
 */
export declare function createEndpoints(app: express.Application, endpoints: EndpointInfo[]): void;
/**
 *
 * @param preprocessor  A function to be run before the handler
 *
 */
export declare const wrapEndpoint: (preprocessor: RequestTransform) => (endpoint: EndpointInfo) => {
    handler: LawnHandler;
    method: Method;
    path: string;
    middleware?: any[] | undefined;
    onResponse?: RequestListener | undefined;
};
export declare const transformEndpoint: (overrides: Partial<EndpointInfo>) => (endpoint: EndpointInfo) => {
    overrides: Partial<EndpointInfo>;
    method: Method;
    path: string;
    handler: LawnHandler;
    middleware?: any[] | undefined;
    onResponse?: RequestListener | undefined;
};
export declare type Transform<T> = (t: T) => T;
export declare function pipe<T>(transforms: Transform<T>[]): Transform<T>;
