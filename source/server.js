"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var api_1 = require("./api");
var Server = (function () {
    function Server(default_preprocessor) {
        this.port = 3000;
        this.default_preprocessor = null;
        this.app = express();
        this.default_preprocessor = default_preprocessor;
    }
    Server.prototype.add_endpoints = function (endpoints, preprocessor) {
        api_1.create_endpoints(this.app, endpoints, preprocessor || this.default_preprocessor);
    };
    Server.prototype.enable_cors = function () {
        this.app.use(require('cors')({
            origin: function (origin, callback) {
                console.log('cors', origin);
                callback(null, true);
            },
            credentials: true
        }));
    };
    Server.prototype.start = function (config) {
        var _this = this;
        this.port = (config && config.port) || 3000;
        return start_express(this.app, this.port)
            .then(function (server) { return _this.node_server = server; });
    };
    Server.prototype.get_app = function () {
        return this.app;
    };
    Server.prototype.get_port = function () {
        return this.port;
    };
    Server.prototype.stop = function () {
        this.node_server.close();
    };
    return Server;
}());
exports.Server = Server;
function start_express(app, port) {
    return new Promise(function (resolve, reject) {
        var server = app.listen(port, function (err) {
            if (err)
                reject("Error starting server");
            console.log('API is listening on port ' + port);
            resolve(server);
        });
    });
}
exports.start_express = start_express;
//# sourceMappingURL=server.js.map