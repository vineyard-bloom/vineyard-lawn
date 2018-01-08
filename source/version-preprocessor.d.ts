import { Version } from "./version";
import { Request, RequestProcessor } from "./types";
export declare function getRequestVersionString(req: any, data: any): string | undefined;
export declare function prepareRequestVersionText(req: any, data: any): string;
export declare function getVersion(req: any, data: any): Version | undefined;
export declare function getSimpleVersion(req: any, data: any): Version | undefined;
export declare function checkVersion(request: Request, versions: Version[]): void;
export declare class VersionPreprocessor {
    private versions;
    constructor(versions: Version[]);
    common(request: Request): Promise<Request>;
    simpleVersion(request: Request): Promise<Request>;
}
export declare function createVersionPreprocessor(versions: Version[]): RequestProcessor;
