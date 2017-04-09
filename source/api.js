// Vineyard Lawn
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
            var request = {
                data: get_arguments(req),
                session: req.session
            };
            endpoint.action(request)
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
function attach_handler(app, endpoint, handler) {
    var path = endpoint.path;
    if (path[0] != '/')
        path = '/' + path;
    var middleware = endpoint.middleware || [];
    if (endpoint.method == Method.get) {
        app.get(path, middleware, handler);
    }
    else {
        app.post(path, [json_parser].concat(middleware), handler);
    }
}
exports.attach_handler = attach_handler;
function create_endpoint(app, endpoint) {
    var handler = create_handler(endpoint);
    attach_handler(app, endpoint, handler);
}
exports.create_endpoint = create_endpoint;
function create_endpoint_with_defaults(app, endpoint_defaults, endpoint) {
    create_endpoint(app, Object.assign({}, endpoint_defaults, endpoint));
}
exports.create_endpoint_with_defaults = create_endpoint_with_defaults;
function create_endpoints(app, endpoints) {
    for (var _i = 0, endpoints_1 = endpoints; _i < endpoints_1.length; _i++) {
        var endpoint = endpoints_1[_i];
        create_endpoint(app, endpoint);
    }
}
exports.create_endpoints = create_endpoints;
//# sourceMappingURL=api.js.map