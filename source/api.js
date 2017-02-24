// Vineyard Lawn
// version 0.1.0
// created by Christopher W. Johnson
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var body_parser = require('body-parser');
__export(require('./errors'));
// const json_parser = body_parser.json()
var json_temp = body_parser.json();
var json_parser = function (req, res, next) {
    json_temp(req, res, next);
};
(function (Method) {
    Method[Method["get"] = 0] = "get";
    Method[Method["post"] = 1] = "post";
})(exports.Method || (exports.Method = {}));
var Method = exports.Method;
function handle_error(res, error) {
    var status = error.status || 500;
    console.error("Error", status, error.message);
    var message = status == 500 ? "Server Error" : error.message;
    res.status(status).send({
        message: message
    });
}
exports.handle_error = handle_error;
// This function is currently modifying req.body for performance though could be changed if it ever caused problems.
function get_arguments(req) {
    var result = req.body || {};
    for (var i in req.query) {
        result[i] = req[i];
    }
    return result;
}
function create_handler(endpoint) {
    return function (req, res) {
        try {
            endpoint.action(get_arguments(req))
                .then(function (content) {
                res.send(content);
            }, function (error) {
                handle_error(res, error);
            });
        }
        catch (error) {
            handle_error(res, error);
        }
    };
}
exports.create_handler = create_handler;
function attach_handler(app, method, route, handler) {
    if (route[0] != '/')
        route = '/' + route;
    if (method == Method.get) {
        app.get(route, handler);
    }
    else {
        app.post(route, json_parser, handler);
    }
}
exports.attach_handler = attach_handler;
// initialize_endpoints() is the primary entry point
function initialize_endpoints(app, endpoints) {
    for (var _i = 0, endpoints_1 = endpoints; _i < endpoints_1.length; _i++) {
        var endpoint = endpoints_1[_i];
        var handler = create_handler(endpoint);
        attach_handler(app, endpoint.method, endpoint.path, handler);
    }
}
exports.initialize_endpoints = initialize_endpoints;
//# sourceMappingURL=api.js.map