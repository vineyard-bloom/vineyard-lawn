export declare class Version {
    major: number;
    minor: number;
    platform: string;
    private createFromString(text);
    static createFromSimpleString(text: string): Version;
    constructor(majorOrString: number | string, minor?: number, platform?: string);
    equals(version: Version): boolean;
    toString(): string;
}
