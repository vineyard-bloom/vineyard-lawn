"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("./errors");
const advancedPattern = /^(\d+)(?:\.(\d+)(?:\.([a-z]+))?)?$/;
const simplePattern = /^v(\d+)$/;
const defaultPlatform = 'none';
class Version {
    constructor(majorOrString, minor = 0, platform = defaultPlatform) {
        this.major = 1;
        this.minor = 0;
        this.platform = '';
        if (typeof majorOrString === 'string') {
            console.error('Initializing a Version object with a string is deprecated.  Use one of the static Version.createFromString methods instead.');
            this.createFromStringOld(majorOrString);
        }
        else {
            this.major = majorOrString;
            this.minor = minor;
            this.platform = platform;
        }
    }
    static createFromString(text) {
        const match = text.match(advancedPattern);
        if (!match)
            return undefined;
        return new Version(parseInt(match[1]), parseInt(match[2]), match[3] ? match[3] : defaultPlatform);
    }
    static createFromSimpleString(text) {
        const match = text.match(simplePattern);
        if (!match)
            return undefined;
        return new Version(parseInt(match[1]));
    }
    createFromStringOld(text) {
        const match = text.match(advancedPattern);
        if (!match)
            throw new errors_1.Bad_Request('Invalid version format: ' + text);
        this.major = parseInt(match[1]);
        this.minor = parseInt(match[2]);
        this.platform = match[3]
            ? match[3]
            : defaultPlatform;
    }
    equals(version) {
        return this.major == version.major && this.minor == version.minor;
    }
    toString() {
        return this.major + '.' + this.minor
            + (this.platform && this.platform != 'none' ? '.' + this.platform : '');
    }
}
exports.Version = Version;
//# sourceMappingURL=version.js.map