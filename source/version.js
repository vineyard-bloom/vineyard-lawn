"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("./errors");
const pattern = /^(\d+)\.(\d+)(\.[a-z]+)?$/;
const defaultPlatform = 'none';
class Version {
    createFromString(text) {
        const match = text.match(pattern);
        if (!match)
            throw new errors_1.Bad_Request('Invalid version format: ' + text);
        this.major = parseInt(match[1]);
        this.minor = parseInt(match[2]);
        this.platform = match[3]
            ? match[3]
            : defaultPlatform;
    }
    constructor(majorOrString, minor = 0, platform = defaultPlatform) {
        if (typeof majorOrString === 'string') {
            this.createFromString(majorOrString);
        }
        else {
            this.major = majorOrString;
            this.minor = minor;
            this.platform = platform;
        }
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