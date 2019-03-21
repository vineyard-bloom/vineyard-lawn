"use strict";
// Lawn will handle any type of thrown errors, but also provides these helper Error types.
Object.defineProperty(exports, "__esModule", { value: true });
class HttpError extends Error {
    constructor(message = 'Server Error', status = 500, body = {}) {
        super(message);
        this.key = '';
        this.status = status;
        this.message = message; // super(message) doesn't seem to be working.
        this.body = body;
    }
    toString() {
        return super.toString() + ' ' + JSON.stringify(this.body);
    }
}
exports.HttpError = HttpError;
class HTTPError extends HttpError {
    constructor(message = 'Server Error', status = 500, body = {}) {
        super(message, status, body);
    }
}
exports.HTTPError = HTTPError;
class BadRequest extends HTTPError {
    constructor(message = 'Bad Request', bodyOrKey = { key: '' }) {
        if (typeof bodyOrKey === 'string') {
            super(message, 400);
            this.key = bodyOrKey;
        }
        else {
            super(message, 400, bodyOrKey);
            this.key = bodyOrKey.key;
        }
    }
}
exports.BadRequest = BadRequest;
class NeedsLogin extends HTTPError {
    constructor(message = 'This request requires a logged in user.') {
        super(message, 401);
    }
}
exports.NeedsLogin = NeedsLogin;
class Unauthorized extends HTTPError {
    constructor(message = 'You are not authorized to perform this request.') {
        super(message, 403);
    }
}
exports.Unauthorized = Unauthorized;
function sendErrorResponse(res, error) {
    const message = error.message = error.status == 500 ? 'Server Error' : error.message;
    const body = {
        message: message,
        key: error.key || error.body.key
    };
    res.status(error.status).json(body);
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
//# sourceMappingURL=errors.js.map