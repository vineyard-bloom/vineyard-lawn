/// <reference types="express" />
/// <reference types="es6-promise" />
import * as express from "express";
export declare class Server {
    private app;
    constructor();
    add_endpoints(endpoints: any): void;
    enable_cors(): void;
    start(port: number): void;
    get_app(): any;
}
export declare function start_express(app: express.Application, port: any): Promise<void>;
