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
export declare type BodyOrString = Body | string;
export declare class BadRequest extends HttpError {
    constructor(message?: string, bodyOrKey?: BodyOrString);
}
export declare class NeedsLogin extends HttpError {
    constructor(message?: string);
}
export declare class Unauthorized extends HttpError {
    constructor(message?: string);
}
export declare class NotFound extends HttpError {
    constructor(message?: string);
}
export declare function sendErrorResponse(res: any, error: HttpError): void;
export declare function handleError(res: any, error: HttpError, listener: RequestListener, request?: LawnRequest<any>): void;
