"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("./errors");
const versioning_1 = require("./versioning");
const types_1 = require("./types");
const bodyParser = require('body-parser');
const jsonTemp = bodyParser.json();
const jsonParser = function (req, res, next) {
    jsonTemp(req, res, next);
};
function logErrorToConsole(error) {
    if (!error.stack)
        console.error('Error', error.status, error.message);
    else
        console.error('Error', error.status, error.stack);
}
exports.logErrorToConsole = logErrorToConsole;
class DefaultRequestListener {
    onRequest(request, response, res) {
        return;
    }
    onError(error, request) {
        logErrorToConsole(error);
        return;
    }
}
class EmptyRequestListener {
    onRequest(request, response, res) {
        return;
    }
    onError(error, request) {
        return;
    }
}
exports.EmptyRequestListener = EmptyRequestListener;
exports.defaultRequestListener = new DefaultRequestListener();
// This function is currently modifying req.body for performance though could be changed if it ever caused problems.
function getArguments(req) {
    const result = req.body || {};
    for (let i in req.query) {
        result[i] = req.query[i];
    }
    return result;
}
function formatRequest(req) {
    const data = getArguments(req);
    const request = {
        data: data,
        version: undefined,
        original: req,
        startTime: new Date().getTime()
    };
    if (req.params)
        request.params = req.params;
    return request;
}
function logRequest(request, listener, response, req) {
    try {
        listener.onRequest(request, response, req);
    }
    catch (error) {
        console.error('Error while logging request', error);
    }
}
function createExpressHandler(endpoint) {
    const onResponse = endpoint.onResponse || exports.defaultRequestListener;
    return async function (req, res) {
        let request;
        try {
            request = formatRequest(req);
        }
        catch (error) {
            console.error('Error in early request handling stages will result in a missing request log.', error);
            errors_1.handleError(res, error, onResponse, undefined);
            return;
        }
        try {
            const content = await endpoint.handler(request);
            res.json(content);
            logRequest(request, onResponse, {
                code: 200,
                message: '',
                body: content
            }, req);
        }
        catch (error) {
            errors_1.handleError(res, error, onResponse, request);
            if (!request.version)
                request.version = new versioning_1.Version(0, 0, 'error');
            logRequest(request, onResponse, {
                code: error.status,
                message: error.message,
                body: error.body
            }, req);
        }
    };
}
exports.createExpressHandler = createExpressHandler;
function registerHttpHandler(app, path, method, handler, middleware) {
    switch (method) {
        case types_1.Method.get:
            app.get(path, middleware, handler);
            break;
        case types_1.Method.post:
            app.post(path, [jsonParser].concat(middleware), handler);
            break;
        case types_1.Method.patch:
            app.patch(path, [jsonParser].concat(middleware), handler);
            break;
        case types_1.Method.put:
            app.put(path, [jsonParser].concat(middleware), handler);
            break;
        case types_1.Method.delete:
            app.delete(path, [jsonParser].concat(middleware), handler);
            break;
    }
}
function attachHandler(app, endpoint, handler) {
    let path = endpoint.path;
    if (path[0] != '/')
        path = '/' + path;
    const middleware = endpoint.middleware || [];
    registerHttpHandler(app, path, endpoint.method, handler, middleware);
    registerHttpHandler(app, '/:version' + path, endpoint.method, handler, middleware);
}
exports.attachHandler = attachHandler;
exports.attachEndpoint = (app) => (endpoint) => {
    const handler = createExpressHandler(endpoint);
    attachHandler(app, endpoint, handler);
};
/**
 *
 * @param app  Express app object to attach the new endpoints
 *
 * @param endpoints  Array of endpoint definitions to create
 *
 */
function createEndpoints(app, endpoints) {
    endpoints.forEach(exports.attachEndpoint(app));
}
exports.createEndpoints = createEndpoints;
function wrapLawnHandler(preprocessor, handler) {
    return (request) => preprocessor(request).then(request => handler(request));
}
function wrapEndpoint(requestTransform) {
    return (endpoint) => (Object.assign({}, endpoint, { handler: wrapLawnHandler(requestTransform, endpoint.handler) }));
}
exports.wrapEndpoint = wrapEndpoint;
function deferTransform(transform) {
    return async (request) => transform(request);
}
exports.deferTransform = deferTransform;
exports.transformEndpoint = (overrides) => (endpoint) => (Object.assign({}, endpoint, overrides));
function pipe(transforms) {
    return original => transforms.reduce((a, b) => b(a), original);
}
exports.pipe = pipe;
function pipeAsync(transforms) {
    if (transforms.length == 0)
        return async (request) => request;
    return async (request) => {
        let result = request;
        for (const transform of transforms) {
            result = await transform(result);
        }
        return result;
    };
}
exports.pipeAsync = pipeAsync;
exports.defineEndpoints = (requestTransform, endpoints) => endpoints.map(wrapEndpoint(requestTransform));
exports.setEndpointListener = (onResponse) => exports.transformEndpoint({ onResponse });
//# sourceMappingURL=api.js.map