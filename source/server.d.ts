import * as express from "express";
import { Request_Processor } from "./api";
import { RequestListener } from "./types";
export interface Server_Config {
    port?: number;
}
export declare class Server {
    private app;
    private node_server;
    private port;
    private default_preprocessor;
    private ajv;
    private requestListener;
    constructor(default_preprocessor?: Request_Processor, requestedListener?: RequestListener);
    private checkAjv();
    compileApiSchema(schema: any): {};
    addApiSchemaHelper(schema: any): void;
    getApiSchema(): any;
    createEndpoints(endpoints: any, preprocessor?: Request_Processor): void;
    add_endpoints(endpoints: any, preprocessor?: Request_Processor): void;
    enable_cors(): void;
    start(config: Server_Config): Promise<void>;
    get_app(): any;
    get_port(): number;
    stop(): void;
}
export declare function start_express(app: express.Application, port: any): Promise<any>;
