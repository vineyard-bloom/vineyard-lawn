// Vineyard Lawn
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var body_parser = require("body-parser");
var validation_1 = require("./validation");
var error_handling_1 = require("./error-handling");
__export(require("./errors"));
// const json_parser = body_parser.json()
var json_temp = body_parser.json();
var json_parser = function (req, res, next) {
    json_temp(req, res, next);
};
var Method;
(function (Method) {
    Method[Method["get"] = 0] = "get";
    Method[Method["post"] = 1] = "post";
    Method[Method["put"] = 2] = "put";
    Method[Method["delete"] = 3] = "delete";
})(Method = exports.Method || (exports.Method = {}));
// This function is currently modifying req.body for performance though could be changed if it ever caused problems.
function get_arguments(req) {
    var result = req.body || {};
    for (var i in req.query) {
        result[i] = req.query[i];
    }
    return result;
}
function create_handler(endpoint, action, ajv) {
    if (endpoint.validator && !ajv)
        throw new Error("Lawn.create_handler argument ajv cannot be null when endpoints have validators.");
    return function (req, res) {
        try {
            var request = {
                data: get_arguments(req),
                session: req.session
            };
            if (req.params)
                request.params = req.params;
            if (endpoint.validator)
                validation_1.validate(endpoint.validator, request.data, ajv);
            action(request)
                .then(function (content) {
                res.send(content);
            }, function (error) {
                error_handling_1.handleError(res, error);
            });
        }
        catch (error) {
            error_handling_1.handleError(res, error);
        }
    };
}
exports.create_handler = create_handler;
function attach_handler(app, endpoint, handler) {
    var path = endpoint.path;
    if (path[0] != '/')
        path = '/' + path;
    var middleware = endpoint.middleware || [];
    switch (endpoint.method) {
        case Method.get:
            app.get(path, middleware, handler);
            break;
        case Method.post:
            app.post(path, [json_parser].concat(middleware), handler);
            break;
        case Method.put:
            app.put(path, [json_parser].concat(middleware), handler);
            break;
        case Method.delete:
            app.delete(path, [json_parser].concat(middleware), handler);
            break;
    }
}
exports.attach_handler = attach_handler;
function create_endpoint(app, endpoint, preprocessor, ajv) {
    if (preprocessor === void 0) { preprocessor = null; }
    if (ajv === void 0) { ajv = null; }
    var action = preprocessor
        ? function (request) { return preprocessor(request).then(function (request) { return endpoint.action(request); }); }
        : endpoint.action;
    var handler = create_handler(endpoint, action, ajv);
    attach_handler(app, endpoint, handler);
}
exports.create_endpoint = create_endpoint;
function create_endpoint_with_defaults(app, endpoint_defaults, endpoint, preprocessor) {
    if (preprocessor === void 0) { preprocessor = null; }
    create_endpoint(app, Object.assign({}, endpoint_defaults, endpoint), preprocessor);
}
exports.create_endpoint_with_defaults = create_endpoint_with_defaults;
function create_endpoints(app, endpoints, preprocessor, ajv) {
    if (preprocessor === void 0) { preprocessor = null; }
    if (ajv === void 0) { ajv = null; }
    for (var _i = 0, endpoints_1 = endpoints; _i < endpoints_1.length; _i++) {
        var endpoint = endpoints_1[_i];
        create_endpoint(app, endpoint, preprocessor, ajv);
    }
}
exports.create_endpoints = create_endpoints;
//# sourceMappingURL=api.js.map