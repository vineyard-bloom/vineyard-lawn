/// <reference types="express" />
import * as express from "express";
import { Endpoint_Info, Optional_Endpoint_Info, RequestListener, Request_Processor } from "./types";
import { HTTP_Error } from "./errors";
export declare function logErrorToConsole(error: HTTP_Error): void;
export declare function create_handler(endpoint: Endpoint_Info, action: any, ajv: any, listener: RequestListener): (req: any, res: any) => void;
export declare function attach_handler(app: express.Application, endpoint: Endpoint_Info, handler: any): void;
export declare function create_endpoint(app: express.Application, endpoint: Endpoint_Info, preprocessor?: Request_Processor, ajv?: any, listener?: RequestListener): void;
export declare function create_endpoint_with_defaults(app: express.Application, endpoint_defaults: Optional_Endpoint_Info, endpoint: Optional_Endpoint_Info, preprocessor?: Request_Processor): void;
export declare function create_endpoints(app: express.Application, endpoints: Endpoint_Info[], preprocessor?: Request_Processor, ajv?: any, listener?: RequestListener): void;
export declare function createEndpoints(app: express.Application, endpoints: Endpoint_Info[], preprocessor?: Request_Processor, ajv?: any, listener?: RequestListener): void;
