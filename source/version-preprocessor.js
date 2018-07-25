"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const version_1 = require("./version");
const errors_1 = require("./errors");
function getRequestVersionString(req, data) {
    return req.params.version
        || data.version
        || undefined;
}
exports.getRequestVersionString = getRequestVersionString;
function prepareRequestVersionText(req, data) {
    const text = getRequestVersionString(req, data);
    if (!text)
        throw new errors_1.Bad_Request('Invalid version format ' + text);
    if (data.version)
        delete data.version;
    return text;
}
exports.prepareRequestVersionText = prepareRequestVersionText;
function getVersion(req, data) {
    const text = prepareRequestVersionText(req, data);
    return version_1.Version.createFromString(text);
}
exports.getVersion = getVersion;
function getSimpleVersion(req, data) {
    const text = prepareRequestVersionText(req, data);
    return version_1.Version.createFromSimpleString(text);
}
exports.getSimpleVersion = getSimpleVersion;
function checkVersion(request, versions) {
    const version = request.version;
    if (!version)
        throw new errors_1.Bad_Request("Missing version property.");
    if (!versions.some(v => v.equals(version)))
        throw new errors_1.Bad_Request("Unsupported version number");
}
exports.checkVersion = checkVersion;
class VersionPreprocessor {
    constructor(versions) {
        if (!versions.length)
            throw new Error('VersionPreprocessor.versions array cannot be empty.');
        this.versions = versions;
    }
    common(request) {
        request.version = getVersion(request.original, request.data);
        checkVersion(request, this.versions);
        return Promise.resolve(request);
    }
    simpleVersion(request) {
        request.version = getSimpleVersion(request.original, request.data);
        checkVersion(request, this.versions);
        return Promise.resolve(request);
    }
}
exports.VersionPreprocessor = VersionPreprocessor;
function createVersionPreprocessor(versions) {
    const helper = new VersionPreprocessor(versions);
    return (request) => helper.simpleVersion(request);
}
exports.createVersionPreprocessor = createVersionPreprocessor;
//# sourceMappingURL=version-preprocessor.js.map