/// <reference types="node" />
export declare class HTTP_Error extends Error {
    status: number;
    constructor(message?: string, status?: number);
}
export declare class Bad_Request extends HTTP_Error {
    constructor(message?: string);
}
export declare class Needs_Login extends HTTP_Error {
    constructor(message?: string);
}
export declare class Unauthorized extends HTTP_Error {
    constructor(message?: string);
}
