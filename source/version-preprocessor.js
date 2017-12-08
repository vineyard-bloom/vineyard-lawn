"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var version_1 = require("./version");
var errors_1 = require("./errors");
function getRequestVersionString(req, data) {
    return req.params.version
        || data.version
        || undefined;
}
exports.getRequestVersionString = getRequestVersionString;
function prepareRequestVersionText(req, data) {
    var text = getRequestVersionString(req, data);
    if (!text)
        throw new errors_1.Bad_Request('Invalid version format ' + text);
    if (data.version)
        delete data.version;
    return text;
}
exports.prepareRequestVersionText = prepareRequestVersionText;
function getVersion(req, data) {
    var text = prepareRequestVersionText(req, data);
    return version_1.Version.createFromString(text);
}
exports.getVersion = getVersion;
function getSimpleVersion(req, data) {
    var text = prepareRequestVersionText(req, data);
    return version_1.Version.createFromSimpleString(text);
}
exports.getSimpleVersion = getSimpleVersion;
function checkVersion(request, versions) {
    var version = request.version;
    if (!version)
        throw new errors_1.Bad_Request("Missing version property.");
    if (!versions.some(function (v) { return v.equals(version); }))
        throw new errors_1.Bad_Request("Unsupported version number");
}
exports.checkVersion = checkVersion;
var VersionPreprocessor = (function () {
    function VersionPreprocessor(versions) {
        if (!versions.length)
            throw new Error('VersionPreprocessor.versions array cannot be empty.');
        this.versions = versions;
    }
    VersionPreprocessor.prototype.common = function (request) {
        request.version = getVersion(request.original, request.data);
        checkVersion(request, this.versions);
        return Promise.resolve(request);
    };
    VersionPreprocessor.prototype.simpleVersion = function (request) {
        request.version = getSimpleVersion(request.original, request.data);
        checkVersion(request, this.versions);
        return Promise.resolve(request);
    };
    return VersionPreprocessor;
}());
exports.VersionPreprocessor = VersionPreprocessor;
//# sourceMappingURL=version-preprocessor.js.map