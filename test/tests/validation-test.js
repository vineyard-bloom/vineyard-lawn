"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lab_1 = require("../../lab");
const webClient = new lab_1.WebClient('http://localhost:3000');
require('source-map-support').install();
const assert = require("assert");
const server_1 = require("../../src/server");
const index_1 = require("../../src/index");
const versioning_1 = require("../../src/versioning");
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
    function localRequest(method, url, data) {
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
                handler: (request) => Promise.resolve(),
                validator: validators.test
            },
        ]);
        return server.start({});
    });
    it('missing required', function () {
        return localRequest('post', 'test')
            .then((result) => {
            assert(false, 'Should have thrown an error');
        })
            .catch((error) => {
            assert.strictEqual(1, error.response.data.errors.length);
            assert.strictEqual('Missing property "weapon"', error.response.data.errors[0]);
        });
    });
    it('wrong property type', function () {
        return localRequest('post', 'test', { weapon: 640 })
            .then((result) => {
            assert(false, 'Should have thrown an error');
        })
            .catch((error) => {
            assert.strictEqual(1, error.response.data.errors.length);
            assert.strictEqual('Property "weapon" should be a string', error.response.data.errors[0]);
        });
    });
    after(function () {
        return server.stop();
    });
});
describe('versioning test', function () {
    let server;
    this.timeout(9000);
    function localRequest(method, url, data) {
        return axios.request({
            url: "http://localhost:3000/" + url,
            method: method,
            data: data
        });
    }
    it('simple version', async function () {
        server = new server_1.Server();
        const validators = server.compileApiSchema(require('../source/api.json'));
        const versionPreprocessor = index_1.versionRequestTransform([new versioning_1.Version(1)]);
        server.createEndpoints((r) => versionPreprocessor(r), [
            {
                method: index_1.Method.post,
                path: "test",
                handler: (request) => Promise.resolve({ message: 'success' }),
                validator: validators.none
            },
        ]);
        await server.start({});
        const result = await localRequest('post', 'v1/test');
        assert.strictEqual(result.data.message, 'success');
    });
    it('creates jar for cookies', async function () {
        let result = await localRequest('post', 'v1/test');
        assert(result.config.jar);
    });
    after(function () {
        return server.stop();
    });
});
describe('versioning-test', function () {
    it('version parsing', function () {
        {
            const version = new versioning_1.Version(1);
            assert.strictEqual(version.major, 1);
            assert.strictEqual(version.minor, 0);
            assert.strictEqual(version.platform, 'none');
        }
        {
            const version = new versioning_1.Version(1);
            assert.strictEqual(version.major, 1);
        }
        {
            const version = versioning_1.Version.fromString('v1');
            assert.strictEqual(version.major, 1);
            assert.strictEqual(version.minor, 0);
            assert.strictEqual(version.platform, 'none');
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
                handler: (request) => Promise.resolve({ data: 'Test data' })
            },
            {
                method: index_1.Method.get,
                path: "params",
                params: { name: 'Jane' },
                handler: (request) => Promise.resolve({ data: 'Jane data' })
            },
            {
                method: index_1.Method.post,
                path: "test",
                handler: (request) => Promise.resolve({ message: 'post successful' })
            },
            {
                method: index_1.Method.patch,
                path: "test",
                handler: (request) => Promise.resolve({ message: 'success' })
            },
        ]);
        return server.start({});
    });
    it('handles a get request', async function () {
        const result = await webClient.get('test');
        assert.deepStrictEqual(result, { data: 'Test data' });
    });
    it('handles a post request', async function () {
        const result = await webClient.post('test', { data: 'New data' });
        assert.deepStrictEqual(result, { message: 'post successful' });
    });
    it('handles a patch request', async function () {
        const result = await webClient.patch('test', { data: 'Some more data' });
        assert.deepStrictEqual(result, { message: 'success' });
    });
    it('adds query string params to URL', async function () {
        const result = await webClient.get('params', { name: 'Jane' });
        assert.deepStrictEqual(result, { data: 'Jane data' });
    });
    after(function () {
        return server.stop();
    });
});
//# sourceMappingURL=validation-test.js.map