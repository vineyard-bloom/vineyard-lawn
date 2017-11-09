import { Version } from "./version";
import { Request } from "./types";
export declare class VersionPreprocessor {
    versions: Version[];
    constructor(versions: Version[]);
    checkVersion(request: Request): void;
    common(request: Request): Promise<Request>;
}
