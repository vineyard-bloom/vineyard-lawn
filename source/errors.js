"use strict";
// Lawn will handle any type of thrown errors, but also provides these helper Error types.
Object.defineProperty(exports, "__esModule", { value: true });
class HttpError extends Error {
    constructor(message = "Server Error", status = 500, body = {}) {
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
class HTTP_Error extends HttpError {
    constructor(message = "Server Error", status = 500, body = {}) {
        super(message, status, body);
    }
}
exports.HTTP_Error = HTTP_Error;
class HTTPError extends HttpError {
    constructor(message = "Server Error", status = 500, body = {}) {
        super(message, status, body);
    }
}
exports.HTTPError = HTTPError;
class Bad_Request extends HTTP_Error {
    constructor(message = "Bad Request", bodyOrKey = { key: '' }) {
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
exports.Bad_Request = Bad_Request;
class BadRequest extends HTTP_Error {
    constructor(message = "Bad Request", bodyOrKey = { key: '' }) {
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
class Needs_Login extends HTTP_Error {
    constructor(message = "This request requires a logged in user.") {
        super(message, 401);
    }
}
exports.Needs_Login = Needs_Login;
class Unauthorized extends HTTP_Error {
    constructor(message = "You are not authorized to perform this request.") {
        super(message, 403);
    }
}
exports.Unauthorized = Unauthorized;
//# sourceMappingURL=errors.js.map