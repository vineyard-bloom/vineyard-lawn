"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("./errors");
var VersionPreprocessor = (function () {
    function VersionPreprocessor(versions) {
        if (!versions.length)
            throw new Error('VersionPreprocessor.versions array cannot be empty.');
        this.versions = versions;
    }
    VersionPreprocessor.prototype.checkVersion = function (request) {
        var version = request.version;
        if (!version)
            throw new errors_1.Bad_Request("Missing version property.");
        if (!this.versions.some(function (v) { return v.equals(version); }))
            throw new errors_1.Bad_Request("Unsupported version number");
    };
    VersionPreprocessor.prototype.common = function (request) {
        this.checkVersion(request);
        return Promise.resolve(request);
    };
    return VersionPreprocessor;
}());
exports.VersionPreprocessor = VersionPreprocessor;
//# sourceMappingURL=version-preprocessor.js.map