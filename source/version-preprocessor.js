"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("./errors");
class VersionPreprocessor {
    constructor(versions) {
        if (!versions.length)
            throw new Error('VersionPreprocessor.versions array cannot be empty.');
        this.versions = versions;
    }
    checkVersion(request) {
        const version = request.version;
        if (!version)
            throw new errors_1.Bad_Request("Missing version property.");
        if (!this.versions.some(v => v.equals(version)))
            throw new errors_1.Bad_Request("Unsupported version number");
    }
    common(request) {
        this.checkVersion(request);
        return Promise.resolve(request);
    }
}
exports.VersionPreprocessor = VersionPreprocessor;
//# sourceMappingURL=version-preprocessor.js.map