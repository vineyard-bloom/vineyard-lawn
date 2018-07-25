import * as express from "express";
import { EndpointInfo, RequestListener, RequestProcessor, ValidationCompiler } from "./types";
export interface SSLConfig {
    enabled?: boolean;
    publicFile?: string;
    privateFile?: string;
}
export interface ServerConfig {
    port?: number;
    ssl?: SSLConfig;
}
export declare type Server_Config = ServerConfig;
export declare class Server implements ValidationCompiler {
    private app;
    private node_server;
    private port;
    private default_preprocessor?;
    private ajv?;
    private requestListener?;
    /**
     * @param defaultPreprocessor  Deprecated
     * @param requestListener   Callback fired any time a request is received
     */
    constructor(defaultPreprocessor?: RequestProcessor, requestListener?: RequestListener);
    private checkAjv;
    /**
     * Compiles an API vaidation schema using ajv.
     */
    compileApiSchema(schema: any): any;
    /**
     * Adds an API validation schema to the Server's ajv instance.
     */
    addApiSchemaHelper(schema: any): void;
    /**
     * Returns the Server's ajv instance.
     */
    getApiSchema(): any;
    /**
     * Main function to create one or more endpoints.
     *
     * @param preprocessor  Function to call before each endpoint handler
     *
     * @param endpoints  Array of endpoint definitions
     *
     */
    createEndpoints(preprocessor: RequestProcessor, endpoints: EndpointInfo[]): void;
    /**
     * Enables wildcard CORS for this server.
     */
    enableCors(): void;
    /**
     * Starts listening for HTTP requests.
     */
    start(config: Server_Config): Promise<void>;
    /**
     * Gets the Server's internal Express app.
     */
    getApp(): any;
    /**
     * Gets the listening HTTP port.
     */
    getPort(): number;
    /**
     * Stops the server.
     */
    stop(): Promise<void>;
}
export declare function start_express(app: express.Application, port: number, ssl: SSLConfig): Promise<any>;
