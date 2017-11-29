"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var api_1 = require("./api");
var Server = (function () {
    /**
     * @param defaultPreprocessor  Deprecated
     * @param requestListener   Callback fired any time a request is received
     */
    function Server(defaultPreprocessor, requestListener) {
        var _this = this;
        this.port = 3000;
        this.app = express();
        this.default_preprocessor = defaultPreprocessor;
        this.requestListener = requestListener;
        // Backwards compatibility
        var self = this;
        self.get_app = this.getApp;
        self.get_port = this.getPort;
        self.enable_cors = this.enableCors;
        self.add_endpoints = function (endpoints, preprocessor) {
            api_1.create_endpoints(_this.app, endpoints, preprocessor, _this.ajv, _this.requestListener);
        };
    }
    Server.prototype.checkAjv = function () {
        if (!this.ajv) {
            var Ajv = require('ajv');
            this.ajv = new Ajv({ allErrors: true });
        }
    };
    /**
     * Compiles an API vaidation schema using ajv.
     */
    Server.prototype.compileApiSchema = function (schema) {
        this.checkAjv();
        var result = {};
        for (var i in schema) {
            var entry = schema[i];
            if (entry.additionalProperties !== true && entry.additionalProperties !== false)
                entry.additionalProperties = false;
            result[i] = this.ajv.compile(schema[i]);
        }
        return result;
    };
    /**
     * Adds an API validation schema to the Server's ajv instance.
     */
    Server.prototype.addApiSchemaHelper = function (schema) {
        this.checkAjv();
        this.ajv.addSchema(schema);
    };
    /**
     * Returns the Server's ajv instance.
     */
    Server.prototype.getApiSchema = function () {
        this.checkAjv();
        return this.ajv;
    };
    /**
     * Main function to create one or more endpoints.
     */
    Server.prototype.createEndpoints = function (preprocessor, endpoints) {
        api_1.create_endpoints(this.app, endpoints, preprocessor, this.ajv, this.requestListener);
    };
    /**
     * Enables wildcard CORS for this server.
     */
    Server.prototype.enableCors = function () {
        this.app.use(require('cors')({
            origin: function (origin, callback) {
                callback(undefined, true);
            },
            credentials: true
        }));
    };
    /**
     * Starts listening for HTTP requests.
     */
    Server.prototype.start = function (config) {
        var _this = this;
        this.port = (config && config.port) || 3000;
        return start_express(this.app, this.port, config.ssl || {})
            .then(function (server) {
            _this.node_server = server;
            console.log('Listening on port ' + _this.port + '.');
        });
    };
    /**
     * Gets the Server's internal Express app.
     */
    Server.prototype.getApp = function () {
        return this.app;
    };
    /**
     * Gets the listening HTTP port.
     */
    Server.prototype.getPort = function () {
        return this.port;
    };
    /**
     * Stops the server.
     */
    Server.prototype.stop = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.node_server.close(function () { return resolve(); });
        });
    };
    return Server;
}());
exports.Server = Server;
function start_express(app, port, ssl) {
    return new Promise(function (resolve, reject) {
        try {
            if (ssl.enabled) {
                var https = require('https');
                var fs = require('fs');
                var privateCert = void 0, publicCert = void 0;
                try {
                    privateCert = fs.readFileSync(ssl.privateFile);
                    publicCert = fs.readFileSync(ssl.publicFile);
                }
                catch (error) {
                    console.error('Error loading ssl cert file.', error);
                    reject(error);
                }
                var server_1 = https.createServer({
                    key: privateCert,
                    cert: publicCert
                }, app)
                    .listen(port, function (err) {
                    if (err)
                        reject("Error starting server (SSL)");
                    console.log('API is listening on port ' + port + ' (SSL)');
                    resolve(server_1);
                });
            }
            else {
                var server_2 = app.listen(port, function (err) {
                    if (err)
                        reject("Error starting server");
                    console.log('API is listening on port ' + port);
                    resolve(server_2);
                });
            }
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.start_express = start_express;
//# sourceMappingURL=server.js.map