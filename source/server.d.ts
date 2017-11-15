/// <reference types="express" />
import * as express from "express";
import { Request_Processor, Endpoint_Info } from "./api";
import { RequestListener, ValidationCompiler } from "./types";
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
    constructor(default_preprocessor?: Request_Processor, requestedListener?: RequestListener);
    private checkAjv();
    compileApiSchema(schema: any): any;
    addApiSchemaHelper(schema: any): void;
    getApiSchema(): any;
    createEndpoints(preprocessor: Request_Processor, endpoints: Endpoint_Info[]): void;
    add_endpoints(endpoints: Endpoint_Info[], preprocessor: Request_Processor): void;
    enableCors(): void;
    start(config: Server_Config): Promise<void>;
    getApp(): any;
    getPort(): number;
    stop(): Promise<void>;
}
export declare function start_express(app: express.Application, port: number, ssl: SSLConfig): Promise<any>;
