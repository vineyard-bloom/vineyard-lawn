import * as express from "express";
import { EndpointInfo, RequestListener, RequestProcessor } from "./types";
import { HTTP_Error } from "./errors";
export declare function logErrorToConsole(error: HTTP_Error): void;
export declare function createHandler(endpoint: EndpointInfo, action: any, ajv: any, listener: RequestListener): (req: any, res: any) => void;
export declare function attachHandler(app: express.Application, endpoint: EndpointInfo, handler: any): void;
export declare function createEndpoint(app: express.Application, endpoint: EndpointInfo, preprocessor?: RequestProcessor, ajv?: any, listener?: RequestListener): void;
/**
 *
 * @param app  Express app object to attach the new endpoints
 *
 * @param endpoints  Array of endpoint definitions to create
 *
 * @param preprocessor  A function to be run before each endpoint handler
 *
 * @param ajv  Ajv object used for schema validation
 *
 * @param listener  Callback fired after each request in the endpoints is handled
 *
 */
export declare function createEndpoints(app: express.Application, endpoints: EndpointInfo[], preprocessor?: RequestProcessor, ajv?: any, listener?: RequestListener): void;
