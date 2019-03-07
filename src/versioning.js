"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("./errors");
const simplePattern = /^v(\d+)$/;
const defaultPlatform = 'none';
class Version {
    constructor(major, minor = 0, platform = defaultPlatform) {
        this.major = 1;
        this.minor = 0;
        this.platform = '';
        this.major = major;
        this.minor = minor;
        this.platform = platform;
    }
    static fromString(text) {
        const match = text.match(simplePattern);
        if (!match)
            return undefined;
        return new Version(parseInt(match[1]));
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
function getRequestVersionString(req, data) {
    return req.params.version
        || data.version
        || undefined;
}
exports.getRequestVersionString = getRequestVersionString;
function prepareRequestVersionText(req, data) {
    const text = getRequestVersionString(req, data);
    if (!text)
        throw new errors_1.BadRequest('Invalid version format ' + text);
    if (data.version)
        delete data.version;
    return text;
}
exports.prepareRequestVersionText = prepareRequestVersionText;
function getSimpleVersion(req, data) {
    const text = prepareRequestVersionText(req, data);
    return Version.fromString(text);
}
exports.getSimpleVersion = getSimpleVersion;
function checkVersion(request, versions) {
    const version = request.version;
    if (!version)
        throw new errors_1.BadRequest('Missing version property.');
    if (!versions.some(v => v.equals(version)))
        throw new errors_1.BadRequest('Unsupported version number');
}
exports.checkVersion = checkVersion;
function applyVersioning(versions) {
    return request => {
        request.version = getSimpleVersion(request.original, request.data);
        checkVersion(request, versions.map(v => new Version(v)));
        return request;
    };
}
exports.applyVersioning = applyVersioning;
//# sourceMappingURL=versioning.js.map