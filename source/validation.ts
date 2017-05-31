import {Bad_Request} from "./errors"

const messageFormatters = {

  required: function (error) {
    const property = error.params.missingProperty
    const path = error.dataPath
      ? [error.dataPath, property].join('.')
      : property

    return 'Missing property ' + path
  },

  type: function (error) {
    const path = error.dataPath.substr(1)
    return 'Property ' + path + ' should be a ' + error.params.type
  },

  additionalProperties: function(error) {
    return 'Unexpected property: ' + error.params.additionalProperty
  }
}

function formatErrorMessage(error): string {
  const formatter = messageFormatters [error.keyword]
  return formatter
    ? formatter(error)
    : error.message
}

export function validate(validator, data: any, ajv) {
  if (!validator(data)) {
    const errors = validator.errors.map(formatErrorMessage)
    // It seems like ajv should be returning multiple errors but it's only returning the first error.
    // throw new Bad_Request(errors[0], {errors: errors})
    throw new Bad_Request(errors[0])
  }
}