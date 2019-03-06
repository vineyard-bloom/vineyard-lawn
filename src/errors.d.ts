import { LawnRequest, RequestListener } from './types';
export declare class HttpError extends Error {
    status: number;
    body: any;
    key: string;
    message: string;
    constructor(message?: string, status?: number, body?: {});
    toString(): string;
}
export interface Body {
    key: string;
    data?: any;
    errors?: any[];
}
export declare class HTTPError extends HttpError {
    constructor(message?: string, status?: number, body?: {});
}
export declare type BodyOrString = Body | string;
export declare class BadRequest extends HTTPError {
    constructor(message?: string, bodyOrKey?: BodyOrString);
}
export declare class NeedsLogin extends HTTPError {
    constructor(message?: string);
}
export declare class Unauthorized extends HTTPError {
    constructor(message?: string);
}
export declare function sendErrorResponse(res: any, error: HttpError): void;
export declare function handleError(res: any, error: HttpError, listener: RequestListener, request?: LawnRequest): void;
