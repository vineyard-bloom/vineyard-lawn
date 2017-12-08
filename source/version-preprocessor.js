"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var version_1 = require("./version");
var errors_1 = require("./errors");
var VersionPreprocessor = (function () {
    function VersionPreprocessor(versions) {
        if (!versions.length)
            throw new Error('VersionPreprocessor.versions array cannot be empty.');
        this.versions = versions;
    }
    VersionPreprocessor.getVersion = function (req, data) {
        if (typeof req.params.version === 'string') {
            return new version_1.Version(req.params.version);
        }
        else if (typeof data.version === 'string') {
            var version = new version_1.Version(data.version);
            delete data.version;
            return version;
        }
        return undefined;
    };
    VersionPreprocessor.getSimpleVersion = function (req, data) {
        if (typeof req.params.version === 'string') {
            return version_1.Version.createFromSimpleString(req.params.version);
        }
        else if (typeof data.version === 'string') {
            var version = version_1.Version.createFromSimpleString(data.version);
            delete data.version;
            return version;
        }
        return undefined;
    };
    VersionPreprocessor.prototype.checkVersion = function (request) {
        var version = request.version;
        if (!version)
            throw new errors_1.Bad_Request("Missing version property.");
        if (!this.versions.some(function (v) { return v.equals(version); }))
            throw new errors_1.Bad_Request("Unsupported version number");
    };
    VersionPreprocessor.prototype.common = function (request) {
        request.version = VersionPreprocessor.getVersion(request.original, request.data);
        this.checkVersion(request);
        return Promise.resolve(request);
    };
    VersionPreprocessor.prototype.simpleVersion = function (request) {
        request.version = VersionPreprocessor.getSimpleVersion(request.original, request.data);
        this.checkVersion(request);
        return Promise.resolve(request);
    };
    return VersionPreprocessor;
}());
exports.VersionPreprocessor = VersionPreprocessor;
//# sourceMappingURL=version-preprocessor.js.map