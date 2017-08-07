"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("./errors");
var characterPattern = /^\^\[(.*?)\][*+]\$$/;
var messageFormatters = {
    maxLength: function (error) {
        return new errors_1.Bad_Request(error.dataPath.substr(1) + ' can not be more than ' + error.params.limit + ' characters.', {
            key: 'max-length',
            data: {
                field: error.dataPath.substr(1),
                limit: error.params.limit
            }
        });
    },
    minLength: function (error) {
        return new errors_1.Bad_Request(error.dataPath.substr(1) + ' must be at least ' + error.params.limit + ' characters.', {
            key: 'min-length',
            data: {
                field: error.dataPath.substr(1),
                limit: error.params.limit
            }
        });
    },
    pattern: function (error, data) {
        var property = error.dataPath.substr(1);
        var match;
        if (match = error.params.pattern.match(characterPattern)) {
            var findInvalid = new RegExp('[^' + match[1] + ']');
            var value = data[property];
            var character = value.match(findInvalid);
            return new errors_1.Bad_Request('Invalid char "' + character[0] + '" in "' + property, {
                key: "invalid-char",
                data: {
                    char: character[0],
                    field: property
                }
            });
        }
        return property + ' ' + error.message;
    },
    required: function (error) {
        var property = error.params.missingProperty;
        var path = error.dataPath
            ? [error.dataPath, property].join('.')
            : property;
        return 'Missing property ' + path;
    },
    type: function (error) {
        var path = error.dataPath.substr(1);
        return 'Property ' + path + ' should be a ' + error.params.type;
    },
    additionalProperties: function (error) {
        return 'Unexpected property: ' + error.params.additionalProperty;
    }
};
function formatErrorMessage(error, data) {
    var formatter = messageFormatters[error.keyword];
    return formatter
        ? formatter(error, data)
        : error.message;
}
function validate(validator, data, ajv) {
    if (!validator(data)) {
        var errors = validator.errors.map(function (e) { return formatErrorMessage(e, data); });
        // It seems like ajv should be returning multiple errors but it's only returning the first error.
        // throw new Bad_Request(errors[0], {errors: errors})
        if (typeof errors[0] === 'string') {
            throw new errors_1.Bad_Request(errors[0]);
        }
        else {
            throw errors[0];
        }
    }
}
exports.validate = validate;
//# sourceMappingURL=validation.js.map