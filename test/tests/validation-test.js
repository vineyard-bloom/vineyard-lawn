"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const version_preprocessor_1 = require("../../source/version-preprocessor");
require('source-map-support').install();
const assert = require("assert");
const server_1 = require("../../source/server");
const index_1 = require("../../source/index");
const version_1 = require("../../source/version");
const request_original = require('request').defaults({ jar: true, json: true });
function request(options) {
    return new Promise(function (resolve, reject) {
        request_original(options, function (error, response, body) {
            const options2 = options;
            if (error)
                reject(error);
            else if (response.statusCode != 200) {
                const error = new Error(response.statusCode + " " + response.statusMessage);
                error.body = response.body;
                reject(error);
            }
            else
                resolve(body);
        });
    });
}
describe('validation test', function () {
    let server;
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
        const validators = server.compileApiSchema(require('../source/api.json'));
        server.createEndpoints(Promise.resolve, [
            {
                method: index_1.Method.post,
                path: "test",
                action: (request) => Promise.resolve(),
                validator: validators.test
            },
        ]);
        return server.start({});
    });
    it('missing required', function () {
        return local_request('post', 'test')
            .then(result => {
            assert(false, 'Should have thrown an error');
        })
            .catch(error => {
            assert.equal(1, error.body.errors.length);
            assert.equal('Missing property "weapon"', error.body.errors[0]);
        });
    });
    it('wrong property type', function () {
        return local_request('post', 'test', { weapon: 640 })
            .then(result => {
            assert(false, 'Should have thrown an error');
        })
            .catch(error => {
            assert.equal(1, error.body.errors.length);
            assert.equal('Property "weapon" should be a string', error.body.errors[0]);
        });
    });
});
describe('versioning test', function () {
    let server;
    this.timeout(9000);
    function local_request(method, url, body) {
        return request({
            url: "http://localhost:3000/" + url,
            method: method,
            body: body
        });
    }
    it('simple version', function () {
        return __awaiter(this, void 0, void 0, function* () {
            server = new server_1.Server();
            const validators = server.compileApiSchema(require('../source/api.json'));
            const versionPreprocessor = new version_preprocessor_1.VersionPreprocessor([new version_1.Version(1)]);
            server.createEndpoints(r => versionPreprocessor.simpleVersion(r), [
                {
                    method: index_1.Method.post,
                    path: "test",
                    action: (request) => Promise.resolve({ message: 'success' }),
                    validator: validators.none
                },
            ]);
            yield server.start({});
            const result = yield local_request('post', 'v1/test');
            assert.equal(result.message, 'success');
        });
    });
});
describe('versioning-test', function () {
    it('version parsing', function () {
        {
            const version = new version_1.Version(1);
            assert.equal(version.major, 1);
            assert.equal(version.minor, 0);
            assert.equal(version.platform, 'none');
        }
        {
            const version = new version_1.Version('1');
            assert.equal(version.major, 1);
        }
        {
            const version = new version_1.Version('1.2.beta');
            assert.equal(version.major, 1);
            assert.equal(version.minor, 2);
            assert.equal(version.platform, 'beta');
        }
    });
});
//# sourceMappingURL=validation-test.js.map