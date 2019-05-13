"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../src");
require('source-map-support').install();
class CustomRequestListener {
    onRequest(request, response, res) {
        return;
    }
    onError(error, request) {
        src_1.logErrorToConsole(error);
        return;
    }
}
describe('endpoint test', function () {
    it('can define endpoints', function () {
        const dummyConversion = request => (Object.assign({}, request, { data: Object.assign({}, request.data, { a: 'rabbit' }) }));
        const dummyConversion2 = request => (Object.assign({}, request, { data: Object.assign({}, request.data, { b: 'bird' }) }));
        const preprocessor = src_1.pipe([
            src_1.applyVersioning([1, 2]),
            dummyConversion
        ]);
        const primaryEndpoints = src_1.defineEndpoints(src_1.deferTransform(preprocessor), [
            {
                method: src_1.Method.get,
                path: 'somewhere',
                handler: async (request) => ({})
            },
            {
                method: src_1.Method.post,
                path: 'somewhere',
                handler: async (request) => ({})
            }
        ]);
        const secondaryEndpoints = src_1.defineEndpoints(src_1.deferTransform(src_1.pipe([preprocessor, dummyConversion2])), [
            {
                method: src_1.Method.get,
                path: 'nowhere',
                handler: async (request) => ({})
            },
            {
                method: src_1.Method.get,
                path: 'elsewhere',
                handler: async (request) => ({})
            },
        ]);
        const endpoints = primaryEndpoints.concat(secondaryEndpoints)
            .map(src_1.transformEndpoint({ onResponse: new CustomRequestListener() }));
    });
});
//# sourceMappingURL=endpoint-test.js.map