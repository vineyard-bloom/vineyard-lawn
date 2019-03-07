import * as express from "express";
export interface SSLConfig {
    enabled?: boolean;
    publicFile?: string;
    privateFile?: string;
}
export interface ApiConfig {
    port?: number;
    ssl?: SSLConfig;
}
export declare function enableCors(app: express.Application): void;
export declare function startExpress(app: express.Application, config: ApiConfig): Promise<any>;
