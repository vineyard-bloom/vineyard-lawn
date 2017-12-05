"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const api_1 = require("./api");
class Server {
    /**
     * @param defaultPreprocessor  Deprecated
     * @param requestListener   Callback fired any time a request is received
     */
    constructor(defaultPreprocessor, requestListener) {
        this.port = 3000;
        this.app = express();
        this.default_preprocessor = defaultPreprocessor;
        this.requestListener = requestListener;
        // Backwards compatibility
        const self = this;
        self.get_app = this.getApp;
        self.get_port = this.getPort;
        self.enable_cors = this.enableCors;
        self.add_endpoints = (endpoints, preprocessor) => {
            api_1.create_endpoints(this.app, endpoints, preprocessor, this.ajv, this.requestListener);
        };
    }
    checkAjv() {
        if (!this.ajv) {
            const Ajv = require('ajv');
            this.ajv = new Ajv({ allErrors: true });
        }
    }
    /**
     * Compiles an API vaidation schema using ajv.
     */
    compileApiSchema(schema) {
        this.checkAjv();
        const result = {};
        for (let i in schema) {
            const entry = schema[i];
            if (entry.additionalProperties !== true && entry.additionalProperties !== false)
                entry.additionalProperties = false;
            result[i] = this.ajv.compile(schema[i]);
        }
        return result;
    }
    /**
     * Adds an API validation schema to the Server's ajv instance.
     */
    addApiSchemaHelper(schema) {
        this.checkAjv();
        this.ajv.addSchema(schema);
    }
    /**
     * Returns the Server's ajv instance.
     */
    getApiSchema() {
        this.checkAjv();
        return this.ajv;
    }
    /**
     * Main function to create one or more endpoints.
     */
    createEndpoints(preprocessor, endpoints) {
        api_1.create_endpoints(this.app, endpoints, preprocessor, this.ajv, this.requestListener);
    }
    /**
     * Enables wildcard CORS for this server.
     */
    enableCors() {
        this.app.use(require('cors')({
            origin: function (origin, callback) {
                callback(undefined, true);
            },
            credentials: true
        }));
    }
    /**
     * Starts listening for HTTP requests.
     */
    start(config) {
        this.port = (config && config.port) || 3000;
        return start_express(this.app, this.port, config.ssl || {})
            .then(server => {
            this.node_server = server;
            console.log('Listening on port ' + this.port + '.');
        });
    }
    /**
     * Gets the Server's internal Express app.
     */
    getApp() {
        return this.app;
    }
    /**
     * Gets the listening HTTP port.
     */
    getPort() {
        return this.port;
    }
    /**
     * Stops the server.
     */
    stop() {
        return new Promise((resolve, reject) => {
            this.node_server.close(() => resolve());
        });
    }
}
exports.Server = Server;
function start_express(app, port, ssl) {
    return new Promise((resolve, reject) => {
        try {
            if (ssl.enabled) {
                const https = require('https');
                const fs = require('fs');
                let privateCert, publicCert;
                try {
                    privateCert = fs.readFileSync(ssl.privateFile);
                    publicCert = fs.readFileSync(ssl.publicFile);
                }
                catch (error) {
                    console.error('Error loading ssl cert file.', error);
                    reject(error);
                }
                const server = https.createServer({
                    key: privateCert,
                    cert: publicCert
                }, app)
                    .listen(port, function (err) {
                    if (err)
                        reject("Error starting server (SSL)");
                    console.log('API is listening on port ' + port + ' (SSL)');
                    resolve(server);
                });
            }
            else {
                const server = app.listen(port, function (err) {
                    if (err)
                        reject("Error starting server");
                    console.log('API is listening on port ' + port);
                    resolve(server);
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