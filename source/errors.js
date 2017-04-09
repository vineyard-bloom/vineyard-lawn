// Lawn will handle any type of thrown errors, but also provides these helper Error types.
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var HTTP_Error = (function (_super) {
    __extends(HTTP_Error, _super);
    function HTTP_Error(message, status) {
        if (message === void 0) { message = "Server Error"; }
        if (status === void 0) { status = 500; }
        _super.call(this, message);
        this.status = status;
    }
    return HTTP_Error;
}(Error));
exports.HTTP_Error = HTTP_Error;
var Bad_Request = (function (_super) {
    __extends(Bad_Request, _super);
    function Bad_Request(message) {
        if (message === void 0) { message = "Bad Request"; }
        _super.call(this, message, 400);
    }
    return Bad_Request;
}(HTTP_Error));
exports.Bad_Request = Bad_Request;
var Needs_Login = (function (_super) {
    __extends(Needs_Login, _super);
    function Needs_Login(message) {
        if (message === void 0) { message = "This request requires a logged in user."; }
        _super.call(this, message, 401);
    }
    return Needs_Login;
}(HTTP_Error));
exports.Needs_Login = Needs_Login;
var Unauthorized = (function (_super) {
    __extends(Unauthorized, _super);
    function Unauthorized(message) {
        if (message === void 0) { message = "You are not authorized to perform this request."; }
        _super.call(this, message, 403);
    }
    return Unauthorized;
}(HTTP_Error));
exports.Unauthorized = Unauthorized;
//# sourceMappingURL=errors.js.map