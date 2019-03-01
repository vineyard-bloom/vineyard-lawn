export declare class Version {
    major: number;
    minor: number;
    platform: string;
    static createFromString(text: string): Version | undefined;
    static createFromSimpleString(text: string): Version | undefined;
    private createFromStringOld(text);
    constructor(majorOrString: number | string, minor?: number, platform?: string);
    equals(version: Version): boolean;
    toString(): string;
}
