export declare class HTTP_Error extends Error {
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
export declare type HttpError = HTTP_Error;
export declare type BodyOrString = Body | string;
export declare class Bad_Request extends HTTP_Error {
    constructor(message?: string, bodyOrKey?: BodyOrString);
}
export declare class BadRequest extends HTTP_Error {
    constructor(message?: string, bodyOrKey?: BodyOrString);
}
export declare class Needs_Login extends HTTP_Error {
    constructor(message?: string);
}
export declare class Unauthorized extends HTTP_Error {
    constructor(message?: string);
}
