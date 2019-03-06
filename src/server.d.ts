import * as express from "express";
import { EndpointInfo, RequestListener, DeferredRequestTransform } from "./types";
export interface SSLConfig {
    enabled?: boolean;
    publicFile?: string;
    privateFile?: string;
}
export interface ServerConfig {
    port?: number;
    ssl?: SSLConfig;
}
export declare class Server {
    readonly app: any;
    private nodeServer;
    private port;
    readonly requestListener?: RequestListener;
    /**
     * @param requestListener   Callback fired any time a request is received
     */
    constructor(requestListener?: RequestListener);
    /**
     * Main function to create one or more endpoints.
     *
     * @param preprocessor  Function to call before each endpoint handler
     *
     * @param endpoints  Array of endpoint definitions
     *
     */
    createEndpoints(preprocessor: DeferredRequestTransform, endpoints: EndpointInfo[]): void;
    /**
     * Enables wildcard CORS for this server.
     */
    enableCors(): void;
    /**
     * Starts listening for HTTP requests.
     */
    start(config: ServerConfig): Promise<void>;
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
export declare function startExpress(app: express.Application, port: number, ssl: SSLConfig): Promise<any>;
