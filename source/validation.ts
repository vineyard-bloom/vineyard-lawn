import {Bad_Request} from "./errors"

const characterPattern = /^\^\[(.*?)\][*+]\$$/

const messageFormatters = {

  maxLength: function (error) {
    return new Bad_Request(error.dataPath.substr(1) + ' can not be more than ' + error.params.limit + ' characters.',
      {
        key: 'max-length',
        data: {
          field: error.dataPath.substr(1),
        limit: error.params.limit
      }
    })
  },

  minLength: function (error) {
    return new Bad_Request(error.dataPath.substr(1) + ' must be at least ' + error.params.limit + ' characters.',
      {
        key: 'min-length',
        data: {
          field: error.dataPath.substr(1),
          limit: error.params.limit
      }
    });
  },

  pattern: function (error, data) {
    const property = error.dataPath.substr(1)
    let match
    if (match = error.params.pattern.match(characterPattern)) {
      const findInvalid = new RegExp('[^' + match[1] + ']')
      const value = data[property]
      const character = value.match(findInvalid)
      return new Bad_Request('Invalid char "' + character[0] + '" in "' + property,
        {
          key: "invalid-char",
          data: {
            char: character[0],
            field: property
        }
      })
    }

    return property + ' ' + error.message
  },

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

  additionalProperties: function (error) {
    return 'Unexpected property: ' + error.params.additionalProperty
  }
}

function formatErrorMessage(error, data): string {
  const formatter = messageFormatters [error.keyword]
  return formatter
    ? formatter(error, data)
    : error.message
}

export function validate(validator, data: any, ajv) {
  if (!validator(data)) {
    const errors = validator.errors.map(e => formatErrorMessage(e, data))
    // It seems like ajv should be returning multiple errors but it's only returning the first error.
    // throw new Bad_Request(errors[0], {errors: errors})
    if (typeof errors[0] === 'string') {
      throw new Bad_Request(errors[0])
    } else {
      throw errors[0]
    }
    
  }
}