"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser = require('body-parser');
const validation_1 = require("./validation");
const error_handling_1 = require("./error-handling");
const version_1 = require("./version");
const types_1 = require("./types");
const json_temp = body_parser.json();
const json_parser = function (req, res, next) {
    json_temp(req, res, next);
};
function logErrorToConsole(error) {
    if (!error.stack)
        console.error("Error", error.status, error.message);
    else
        console.error("Error", error.status, error.stack);
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
// This function is currently modifying req.body for performance though could be changed if it ever caused problems.
function get_arguments(req) {
    const result = req.body || {};
    for (let i in req.query) {
        result[i] = req.query[i];
    }
    return result;
}
function getVersion(req, data) {
    if (typeof req.params.version === 'string') {
        return new version_1.Version(req.params.version);
    }
    else if (typeof data.version === 'string') {
        const version = new version_1.Version(data.version);
        delete data.version;
        return version;
    }
    return undefined;
}
function formatRequest(req) {
    const data = get_arguments(req);
    const request = {
        data: data,
        session: req.session,
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
function create_handler(endpoint, action, ajv, listener) {
    if (endpoint.validator && !ajv)
        throw new Error("Lawn.create_handler argument ajv cannot be undefined when endpoints have validators.");
    return function (req, res) {
        let request;
        try {
            request = formatRequest(req);
        }
        catch (error) {
            console.error('Error in early request handling stages will result in a missing request log.', error);
            error_handling_1.handleError(res, error, listener, undefined);
            return;
        }
        try {
            request.version = getVersion(req, request.data);
            if (endpoint.validator)
                validation_1.validate(endpoint.validator, request.data, ajv);
            action(request)
                .then(function (content) {
                res.send(content);
                logRequest(request, listener, {
                    code: 200,
                    message: "",
                    body: content
                }, req);
            }, function (error) {
                error_handling_1.handleError(res, error, listener, request);
                logRequest(request, listener, {
                    code: error.status,
                    message: error.message,
                    body: error.body
                }, req);
            });
        }
        catch (error) {
            error_handling_1.handleError(res, error, listener, undefined);
            if (!request.version)
                request.version = new version_1.Version(0, 0, 'error');
            logRequest(request, listener, {
                code: error.status,
                message: error.message,
                body: error.body
            }, req);
        }
    };
}
exports.create_handler = create_handler;
function register_http_handler(app, path, method, handler, middleware) {
    switch (method) {
        case types_1.Method.get:
            app.get(path, middleware, handler);
            break;
        case types_1.Method.post:
            app.post(path, [json_parser].concat(middleware), handler);
            break;
        case types_1.Method.put:
            app.put(path, [json_parser].concat(middleware), handler);
            break;
        case types_1.Method.delete:
            app.delete(path, [json_parser].concat(middleware), handler);
            break;
    }
}
function attach_handler(app, endpoint, handler) {
    let path = endpoint.path;
    if (path[0] != '/')
        path = '/' + path;
    const middleware = endpoint.middleware || [];
    register_http_handler(app, path, endpoint.method, handler, middleware);
    register_http_handler(app, '/:version' + path, endpoint.method, handler, middleware);
}
exports.attach_handler = attach_handler;
function create_endpoint(app, endpoint, preprocessor, ajv, listener = new DefaultRequestListener()) {
    const action = preprocessor
        ? (request) => preprocessor(request).then(request => endpoint.action(request))
        : endpoint.action;
    const handler = create_handler(endpoint, action, ajv, listener);
    attach_handler(app, endpoint, handler);
}
exports.create_endpoint = create_endpoint;
function create_endpoint_with_defaults(app, endpoint_defaults, endpoint, preprocessor) {
    const info = Object.assign({}, endpoint_defaults, endpoint);
    create_endpoint(app, info, preprocessor);
}
exports.create_endpoint_with_defaults = create_endpoint_with_defaults;
function create_endpoints(app, endpoints, preprocessor, ajv, listener = new DefaultRequestListener()) {
    for (let endpoint of endpoints) {
        create_endpoint(app, endpoint, preprocessor, ajv, listener);
    }
}
exports.create_endpoints = create_endpoints;
function createEndpoints(app, endpoints, preprocessor, ajv, listener = new DefaultRequestListener()) {
    return create_endpoints(app, endpoints, preprocessor, ajv, listener);
}
exports.createEndpoints = createEndpoints;
//# sourceMappingURL=api.js.map