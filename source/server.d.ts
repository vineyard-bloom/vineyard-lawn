import * as express from "express";
import { Request_Processor } from "./api";
export interface Server_Config {
    port?: number;
}
export declare class Server {
    private app;
    private node_server;
    private port;
    private default_preprocessor;
    constructor(default_preprocessor?: Request_Processor);
    add_endpoints(endpoints: any, preprocessor?: Request_Processor): void;
    enable_cors(): void;
    start(config: Server_Config): Promise<void>;
    get_app(): any;
    get_port(): number;
    stop(): void;
}
export declare function start_express(app: express.Application, port: any): Promise<any>;
