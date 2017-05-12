"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logErrors = true;
function setErrorLogging(value) {
    logErrors = value;
}
exports.setErrorLogging = setErrorLogging;
function handleError(res, error) {
    var status = error.status || 500;
    if (logErrors) {
        if (!error.stack)
            console.error("Error", status, error.message);
        else
            console.error("Error", status, error.stack);
    }
    var message = status == 500 ? "Server Error" : error.message;
    res.statusMessage = message;
    var body = error.body || {
        message: message
    };
    res.status(status).send(body);
}
exports.handleError = handleError;
//# sourceMappingURL=error-handling.js.map