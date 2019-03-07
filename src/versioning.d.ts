import { LawnRequest, RequestTransform } from './types';
import * as express from 'express';
export declare class Version {
    major: number;
    minor: number;
    platform: string;
    static fromString(text: string): Version | undefined;
    constructor(major: number, minor?: number, platform?: string);
    equals(version: Version): boolean;
    toString(): string;
}
export declare function getRequestVersionString(req: any, data: any): string | undefined;
export declare function prepareRequestVersionText(req: any, data: any): string;
export declare function getSimpleVersion(req: express.Request, data: any): Version | undefined;
export declare function checkVersion(request: LawnRequest, versions: Version[]): void;
export declare function applyVersioning(versions: number[]): RequestTransform;
