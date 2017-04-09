/// <reference types="es6-promise" />
/// <reference types="express" />
import * as express from "express";
export interface Server_Config {
    port?: number;
}
export declare class Server {
    private app;
    private node_server;
    private port;
    constructor();
    add_endpoints(endpoints: any): void;
    enable_cors(): void;
    start(config: Server_Config): Promise<void>;
    get_app(): any;
    get_port(): number;
    stop(): void;
}
export declare function start_express(app: express.Application, port: any): Promise<any>;
