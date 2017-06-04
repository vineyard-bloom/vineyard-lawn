"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var body_parser = require("body-parser");
var validation_1 = require("./validation");
var error_handling_1 = require("./error-handling");
var version_1 = require("./version");
var types_1 = require("./types");
var json_temp = body_parser.json();
var json_parser = function (req, res, next) {
    json_temp(req, res, next);
};
function logErrorToConsole(error) {
    if (!error.stack)
        console.error("Error", error.status, error.message);
    else
        console.error("Error", error.status, error.stack);
}
exports.logErrorToConsole = logErrorToConsole;
var DefaultRequestListener = (function () {
    function DefaultRequestListener() {
    }
    DefaultRequestListener.prototype.onRequest = function (request, response, res) {
        return;
    };
    DefaultRequestListener.prototype.onError = function (error, request) {
        logErrorToConsole(error);
        return;
    };
    return DefaultRequestListener;
}());
// This function is currently modifying req.body for performance though could be changed if it ever caused problems.
function get_arguments(req) {
    var result = req.body || {};
    for (var i in req.query) {
        result[i] = req.query[i];
    }
    return result;
}
function formatRequest(req) {
    var version = null;
    var data = get_arguments(req);
    if (typeof req.params.version == 'string') {
        version = new version_1.Version(req.params.version);
    }
    else if (typeof data.version == 'string') {
        version = new version_1.Version(data.version);
        delete data.version;
    }
    var request = {
        data: data,
        session: req.session,
        version: version,
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
        throw new Error("Lawn.create_handler argument ajv cannot be null when endpoints have validators.");
    return function (req, res) {
        try {
            var request_1 = formatRequest(req);
            if (endpoint.validator)
                validation_1.validate(endpoint.validator, request_1.data, ajv);
            action(request_1)
                .then(function (content) {
                res.send(content);
                logRequest(request_1, listener, {
                    code: 200,
                    message: "",
                    body: content
                }, req);
            }, function (error) {
                error_handling_1.handleError(res, error, listener, request_1);
                logRequest(request_1, listener, {
                    code: error.status,
                    message: error.message,
                    body: error.body
                }, req);
            });
        }
        catch (error) {
            console.error('Error in early request handling stages will result in a missing request log.', error);
            error_handling_1.handleError(res, error, listener, null);
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
    var path = endpoint.path;
    if (path[0] != '/')
        path = '/' + path;
    var middleware = endpoint.middleware || [];
    register_http_handler(app, path, endpoint.method, handler, middleware);
    register_http_handler(app, '/:version' + path, endpoint.method, handler, middleware);
}
exports.attach_handler = attach_handler;
function create_endpoint(app, endpoint, preprocessor, ajv, listener) {
    if (preprocessor === void 0) { preprocessor = null; }
    if (ajv === void 0) { ajv = null; }
    if (listener === void 0) { listener = new DefaultRequestListener(); }
    var action = preprocessor
        ? function (request) { return preprocessor(request).then(function (request) { return endpoint.action(request); }); }
        : endpoint.action;
    var handler = create_handler(endpoint, action, ajv, listener);
    attach_handler(app, endpoint, handler);
}
exports.create_endpoint = create_endpoint;
function create_endpoint_with_defaults(app, endpoint_defaults, endpoint, preprocessor) {
    if (preprocessor === void 0) { preprocessor = null; }
    create_endpoint(app, Object.assign({}, endpoint_defaults, endpoint), preprocessor);
}
exports.create_endpoint_with_defaults = create_endpoint_with_defaults;
function create_endpoints(app, endpoints, preprocessor, ajv, listener) {
    if (preprocessor === void 0) { preprocessor = null; }
    if (ajv === void 0) { ajv = null; }
    if (listener === void 0) { listener = new DefaultRequestListener(); }
    for (var _i = 0, endpoints_1 = endpoints; _i < endpoints_1.length; _i++) {
        var endpoint = endpoints_1[_i];
        create_endpoint(app, endpoint, preprocessor, ajv, listener);
    }
}
exports.create_endpoints = create_endpoints;
function createEndpoints(app, endpoints, preprocessor, ajv, listener) {
    if (preprocessor === void 0) { preprocessor = null; }
    if (ajv === void 0) { ajv = null; }
    if (listener === void 0) { listener = new DefaultRequestListener(); }
    return create_endpoints(app, endpoints, preprocessor, ajv, listener);
}
exports.createEndpoints = createEndpoints;
//# sourceMappingURL=api.js.map