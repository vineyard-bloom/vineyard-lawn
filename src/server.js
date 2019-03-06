"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const api_1 = require("./api");
class Server {
    /**
     * @param requestListener   Callback fired any time a request is received
     */
    constructor(requestListener) {
        this.port = 3000;
        this.app = express();
        this.requestListener = requestListener;
    }
    /**
     * Main function to create one or more endpoints.
     *
     * @param preprocessor  Function to call before each endpoint handler
     *
     * @param endpoints  Array of endpoint definitions
     *
     */
    createEndpoints(preprocessor, endpoints) {
        api_1.createEndpoints(this.app, endpoints, preprocessor, this.requestListener);
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
        return startExpress(this.app, this.port, config.ssl || {})
            .then(server => {
            this.nodeServer = server;
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
            this.nodeServer.close(() => resolve());
        });
    }
}
exports.Server = Server;
function startExpress(app, port, ssl) {
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
exports.startExpress = startExpress;
//# sourceMappingURL=server.js.map