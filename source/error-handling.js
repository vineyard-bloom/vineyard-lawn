"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sendErrorResponse(res, error) {
    const message = error.message = error.status == 500 ? "Server Error" : error.message;
    res.statusMessage = message;
    const body = {
        message: error.message,
        errors: error.body.errors
    };
    res.status(error.status).send(body);
}
exports.sendErrorResponse = sendErrorResponse;
function handleError(res, error, listener, request) {
    error.status = error.status || 500;
    try {
        listener.onError(error, request || undefined);
    }
    catch (error) {
        console.error('Error while logging http handling error', error);
    }
    return sendErrorResponse(res, error);
}
exports.handleError = handleError;
//# sourceMappingURL=error-handling.js.map