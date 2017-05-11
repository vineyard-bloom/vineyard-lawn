import {Bad_Request} from "./errors"

const messageFormatters = {

  required: function (error) {
    const property = error.params.missingProperty
    const path = error.dataPath
      ? [error.dataPath, property].join('.')
      : property

    return 'Missing property "' + path + '".'
  },

  type: function (error) {
    const path = error.dataPath.substr(1)
    return 'Property "' + path + '" should be a ' + error.params.type + '.'
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
    throw new Bad_Request(errors[0], {errors: errors})
  }
}