"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("./errors");
var advancedPattern = /^(\d+)(?:\.(\d+)(?:\.([a-z]+))?)?$/;
var simplePattern = /^v(\d+)$/;
var defaultPlatform = 'none';
var Version = /** @class */ (function () {
    function Version(majorOrString, minor, platform) {
        if (minor === void 0) { minor = 0; }
        if (platform === void 0) { platform = defaultPlatform; }
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
    Version.createFromString = function (text) {
        var match = text.match(advancedPattern);
        if (!match)
            return undefined;
        return new Version(parseInt(match[1]), parseInt(match[2]), match[3] ? match[3] : defaultPlatform);
    };
    Version.createFromSimpleString = function (text) {
        var match = text.match(simplePattern);
        if (!match)
            return undefined;
        return new Version(parseInt(match[1]));
    };
    Version.prototype.createFromStringOld = function (text) {
        var match = text.match(advancedPattern);
        if (!match)
            throw new errors_1.Bad_Request('Invalid version format: ' + text);
        this.major = parseInt(match[1]);
        this.minor = parseInt(match[2]);
        this.platform = match[3]
            ? match[3]
            : defaultPlatform;
    };
    Version.prototype.equals = function (version) {
        return this.major == version.major && this.minor == version.minor;
    };
    Version.prototype.toString = function () {
        return this.major + '.' + this.minor
            + (this.platform && this.platform != 'none' ? '.' + this.platform : '');
    };
    return Version;
}());
exports.Version = Version;
//# sourceMappingURL=version.js.map