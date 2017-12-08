import { Version } from "./version";
import { Request } from "./types";
export declare class VersionPreprocessor {
    versions: Version[];
    constructor(versions: Version[]);
    static getVersion(req: any, data: any): Version | undefined;
    static getSimpleVersion(req: any, data: any): Version | undefined;
    checkVersion(request: Request): void;
    common(request: Request): Promise<Request>;
    simpleVersion(request: Request): Promise<Request>;
}
