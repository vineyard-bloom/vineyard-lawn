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
var lab_1 = require("../../lab");
var webClient = new lab_1.WebClient('http://localhost:3000');
require('source-map-support').install();
var assert = require("assert");
var server_1 = require("../../source/server");
var index_1 = require("../../source/index");
var version_1 = require("../../source/version");
var axios = require('axios').default;
var axiosCookieJarSupport = require('axios-cookiejar-support').default;
var tough = require('tough-cookie');
axiosCookieJarSupport(axios);
var cookieJar = new tough.CookieJar();
axios.defaults.jar = true;
axios.defaults.withCredentials = true;
describe('validation test', function () {
    var server;
    this.timeout(5000);
    function local_request(method, url, data) {
        return axios.request({
            url: "http://localhost:3000/" + url,
            method: method,
            data: data
        });
    }
    before(function () {
        server = new server_1.Server();
        var validators = server.compileApiSchema(require('../source/api.json'));
        server.createEndpoints(function () { return Promise.resolve(); }, [
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
            assert.equal(1, error.response.data.errors.length);
            assert.equal('Missing property "weapon"', error.response.data.errors[0]);
        });
    });
    it('wrong property type', function () {
        return local_request('post', 'test', { weapon: 640 })
            .then(function (result) {
            assert(false, 'Should have thrown an error');
        })
            .catch(function (error) {
            assert.equal(1, error.response.data.errors.length);
            assert.equal('Property "weapon" should be a string', error.response.data.errors[0]);
        });
    });
    after(function () {
        return server.stop();
    });
});
describe('versioning test', function () {
    var server;
    this.timeout(9000);
    function local_request(method, url, data) {
        return axios.request({
            url: "http://localhost:3000/" + url,
            method: method,
            data: data
        });
    }
    it('simple version', function () {
        return __awaiter(this, void 0, void 0, function () {
            var validators, versionPreprocessor, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server = new server_1.Server();
                        validators = server.compileApiSchema(require('../source/api.json'));
                        versionPreprocessor = new version_preprocessor_1.VersionPreprocessor([new version_1.Version(1)]);
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
                        assert.equal(result.data.message, 'success');
                        return [2 /*return*/];
                }
            });
        });
    });
    after(function () {
        return server.stop();
    });
});
describe('versioning-test', function () {
    it('version parsing', function () {
        {
            var version = new version_1.Version(1);
            assert.equal(version.major, 1);
            assert.equal(version.minor, 0);
            assert.equal(version.platform, 'none');
        }
        {
            var version = new version_1.Version('1');
            assert.equal(version.major, 1);
        }
        {
            var version = new version_1.Version('1.2.beta');
            assert.equal(version.major, 1);
            assert.equal(version.minor, 2);
            assert.equal(version.platform, 'beta');
        }
    });
});
describe('API call test', function () {
    var server;
    this.timeout(9000);
    before(function () {
        var data = 'Test data';
        server = new server_1.Server();
        server.createEndpoints(function () { return Promise.resolve(); }, [
            {
                method: index_1.Method.get,
                path: "test",
                action: function (request) { return Promise.resolve({ data: data }); }
            },
            {
                method: index_1.Method.patch,
                path: "test",
                action: function (request) { return Promise.resolve({ message: 'success' }); }
            },
        ]);
        return server.start({});
    });
    it('handles a get request', function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, webClient.get('test')];
                    case 1:
                        result = _a.sent();
                        assert.deepEqual(result, { data: 'Test data' });
                        return [2 /*return*/];
                }
            });
        });
    });
    it('handles a patch request', function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, webClient.patch('test', { data: 'Some more data' })];
                    case 1:
                        result = _a.sent();
                        assert.deepEqual(result, { message: 'success' });
                        return [2 /*return*/];
                }
            });
        });
    });
    after(function () {
        return server.stop();
    });
});
//# sourceMappingURL=validation-test.js.map