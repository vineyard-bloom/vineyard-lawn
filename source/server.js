"use strict";
var express = require("express");
var api_1 = require("./api");
var Server = (function () {
    function Server() {
        this.app = express();
    }
    Server.prototype.add_endpoints = function (endpoints) {
        api_1.initialize_endpoints(this.app, endpoints);
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
    Server.prototype.start = function (port) {
        start_express(this.app, port);
    };
    Server.prototype.get_app = function () {
        return this.app;
    };
    return Server;
}());
exports.Server = Server;
function start_express(app, port) {
    return new Promise(function (resolve, reject) {
        app.listen(port, function (err) {
            if (err)
                reject("Error starting server");
            console.log('API is listening on port ' + port);
            resolve();
        });
    });
}
exports.start_express = start_express;
//# sourceMappingURL=server.js.map