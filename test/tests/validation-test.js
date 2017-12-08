"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var version_preprocessor_1 = require("../../source/version-preprocessor");
require('source-map-support').install();
var assert = require("assert");
var server_1 = require("../../source/server");
var index_1 = require("../../source/index");
var version_1 = require("../../source/version");
var request_original = require('request').defaults({ jar: true, json: true });
function request(options) {
    return new Promise(function (resolve, reject) {
        request_original(options, function (error, response, body) {
            var options2 = options;
            if (error)
                reject(error);
            else if (response.statusCode != 200) {
                var error_1 = new Error(response.statusCode + " " + response.statusMessage);
                error_1.body = response.body;
                reject(error_1);
            }
            else
                resolve(body);
        });
    });
}
describe('validation test', function () {
    var server;
    this.timeout(5000);
    function local_request(method, url, body) {
        return request({
            url: "http://localhost:3000/" + url,
            method: method,
            body: body
        });
    }
    function login(username, password) {
        return local_request('post', 'user/login', {
            username: username,
            password: password
        });
    }
    before(function () {
        server = new server_1.Server();
        var validators = server.compileApiSchema(require('../source/api.json'));
        server.createEndpoints(Promise.resolve, [
            {
                method: index_1.Method.post,
                path: "test",
                action: function (request) { return Promise.resolve(); },
                validator: validators.test
            },
        ]);
        return server.start({});
    });
    it('missing required', function () {
        return local_request('post', 'test')
            .then(function (result) {
            assert(false, 'Should have thrown an error');
        })
            .catch(function (error) {
            assert.equal(1, error.body.errors.length);
            assert.equal('Missing property "weapon"', error.body.errors[0]);
        });
    });
    it('wrong property type', function () {
        return local_request('post', 'test', { weapon: 640 })
            .then(function (result) {
            assert(false, 'Should have thrown an error');
        })
            .catch(function (error) {
            assert.equal(1, error.body.errors.length);
            assert.equal('Property "weapon" should be a string', error.body.errors[0]);
        });
    });
});
describe('versioning test', function () {
    var server;
    this.timeout(9000);
    function local_request(method, url, body) {
        return request({
            url: "http://localhost:3000/" + url,
            method: method,
            body: body
        });
    }
    it('simple version', function () {
        return __awaiter(this, void 0, void 0, function () {
            var versionPreprocessor, validators, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server = new server_1.Server();
                        versionPreprocessor = new version_preprocessor_1.VersionPreprocessor([new version_1.Version(1)]);
                        validators = server.compileApiSchema(require('../source/api.json'));
                        server.createEndpoints(function (r) { return versionPreprocessor.simpleVersion(r); }, [
                            {
                                method: index_1.Method.post,
                                path: "test",
                                action: function (request) { return Promise.resolve({ message: 'success' }); },
                                validator: validators.none
                            },
                        ]);
                        return [4 /*yield*/, server.start({})];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, local_request('post', 'v1/test')];
                    case 2:
                        result = _a.sent();
                        assert.equal(result.message, 'success');
                        return [2 /*return*/];
                }
            });
        });
    });
});
//# sourceMappingURL=validation-test.js.map