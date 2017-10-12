import { Request, RequestListener } from './types';
import { HTTP_Error } from "./errors";
export declare function sendErrorResponse(res: any, error: HTTP_Error): void;
export declare function handleError(res: any, error: HTTP_Error, listener: RequestListener, request?: Request | null): void;
