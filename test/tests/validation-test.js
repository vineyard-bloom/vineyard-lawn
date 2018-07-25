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
const lab_1 = require("../../lab");
const webClient = new lab_1.WebClient('http://localhost:3000');
require('source-map-support').install();
const assert = require("assert");
const server_1 = require("../../source/server");
const index_1 = require("../../source/index");
const version_1 = require("../../source/version");
const axios = require('axios').default;
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');
axiosCookieJarSupport(axios);
const cookieJar = new tough.CookieJar();
axios.defaults.jar = true;
axios.defaults.withCredentials = true;
describe('validation test', function () {
    let server;
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
        const validators = server.compileApiSchema(require('../source/api.json'));
        server.createEndpoints(() => Promise.resolve(), [
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
            .then((result) => {
            assert(false, 'Should have thrown an error');
        })
            .catch((error) => {
            assert.equal(1, error.response.data.errors.length);
            assert.equal('Missing property "weapon"', error.response.data.errors[0]);
        });
    });
    it('wrong property type', function () {
        return local_request('post', 'test', { weapon: 640 })
            .then((result) => {
            assert(false, 'Should have thrown an error');
        })
            .catch((error) => {
            assert.equal(1, error.response.data.errors.length);
            assert.equal('Property "weapon" should be a string', error.response.data.errors[0]);
        });
    });
    after(function () {
        return server.stop();
    });
});
describe('versioning test', function () {
    let server;
    this.timeout(9000);
    function local_request(method, url, data) {
        return axios.request({
            url: "http://localhost:3000/" + url,
            method: method,
            data: data
        });
    }
    it('simple version', function () {
        return __awaiter(this, void 0, void 0, function* () {
            server = new server_1.Server();
            const validators = server.compileApiSchema(require('../source/api.json'));
            const versionPreprocessor = new version_preprocessor_1.VersionPreprocessor([new version_1.Version(1)]);
            server.createEndpoints((r) => versionPreprocessor.simpleVersion(r), [
                {
                    method: index_1.Method.post,
                    path: "test",
                    action: (request) => Promise.resolve({ message: 'success' }),
                    validator: validators.none
                },
            ]);
            yield server.start({});
            const result = yield local_request('post', 'v1/test');
            assert.equal(result.data.message, 'success');
        });
    });
    it('creates jar for cookies', function () {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield local_request('post', 'v1/test');
            assert(result.config.jar);
        });
    });
    after(function () {
        return server.stop();
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
describe('API call test', function () {
    let server;
    this.timeout(9000);
    before(function () {
        server = new server_1.Server();
        server.createEndpoints(() => Promise.resolve(), [
            {
                method: index_1.Method.get,
                path: "test",
                action: (request) => Promise.resolve({ data: 'Test data' })
            },
            {
                method: index_1.Method.get,
                path: "params",
                params: { name: 'Jane' },
                action: (request) => Promise.resolve({ data: 'Jane data' })
            },
            {
                method: index_1.Method.post,
                path: "test",
                action: (request) => Promise.resolve({ message: 'post successful' })
            },
            {
                method: index_1.Method.patch,
                path: "test",
                action: (request) => Promise.resolve({ message: 'success' })
            },
        ]);
        return server.start({});
    });
    it('handles a get request', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield webClient.get('test');
            assert.deepEqual(result, { data: 'Test data' });
        });
    });
    it('handles a post request', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield webClient.post('test', { data: 'New data' });
            assert.deepEqual(result, { message: 'post successful' });
        });
    });
    it('handles a patch request', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield webClient.patch('test', { data: 'Some more data' });
            assert.deepEqual(result, { message: 'success' });
        });
    });
    it('adds query string params to URL', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield webClient.get('params', { name: 'Jane' });
            assert.deepEqual(result, { data: 'Jane data' });
        });
    });
    after(function () {
        return server.stop();
    });
});
//# sourceMappingURL=validation-test.js.map