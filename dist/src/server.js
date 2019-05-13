"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function enableCors(app) {
    app.use(require('cors')({
        origin: function (origin, callback) {
            callback(undefined, true);
        },
        credentials: true
    }));
}
exports.enableCors = enableCors;
function startExpress(app, config) {
    const { ssl } = config;
    const port = config.port || 3000;
    return new Promise((resolve, reject) => {
        try {
            if (ssl && ssl.enabled) {
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