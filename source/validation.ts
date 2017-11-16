import {Bad_Request} from "./errors"

const characterPattern = /^\^\[(.*?)\][*+]\$$/

interface ValidationParams {
  limit: string
  pattern: string
  missingProperty?: string
  type: string
  additionalProperty?: string
}

interface ValidationError {
  keyword: string
  dataPath: string
  params: ValidationParams
  message: string
}

type Validator = (error: ValidationError, data?: any) => Bad_Request | string

const messageFormatters: { [key: string]: Validator } = {

  maxLength: function (error: ValidationError) {
    return new Bad_Request(error.dataPath.substr(1) + ' can not be more than ' + error.params.limit + ' characters.',
      {
        key: 'max-length',
        data: {
          field: error.dataPath.substr(1),
          limit: error.params.limit
        }
      })
  },

  minLength: function (error: ValidationError) {
    return new Bad_Request(error.dataPath.substr(1) + ' must be at least ' + error.params.limit + ' characters.',
      {
        key: 'min-length',
        data: {
          field: error.dataPath.substr(1),
          limit: error.params.limit
        }
      });
  },

  pattern: function (error: ValidationError, data: any) {
    const property = error.dataPath.substr(1)
    let match
    if (match = error.params.pattern.match(characterPattern)) {
      const findInvalid = new RegExp('[^' + match[1] + ']')
      const value = data[property]
      if (!value || !value.match)
        return new Bad_Request('Invalid value for property "' + property + '"')

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

  required: function (error: ValidationError) {
    const property = error.params.missingProperty
    const path = error.dataPath
      ? [error.dataPath, property].join('.')
      : property

    return 'Missing property "' + path + '"'
  },

  type: function (error: ValidationError) {
    const path = error.dataPath.substr(1)
    return 'Property "' + path + '" should be a ' + error.params.type
  },

  additionalProperties: function (error: ValidationError) {
    return 'Unexpected property: ' + error.params.additionalProperty
  }
}

function formatErrorMessage(error: ValidationError, data: any): string | Bad_Request {
  const formatter = messageFormatters [error.keyword]
  return formatter
    ? formatter(error, data)
    : error.message
}

export function validate(validator: any, data: any, ajv: any) {
  if (!validator(data)) {
    const errors = validator.errors.map((e: ValidationError) => formatErrorMessage(e, data))
    // It seems like ajv should be returning multiple errors but it's only returning the first error.
    throw new Bad_Request('Bad Request', {errors: errors, key: ''})
    // if (typeof errors[0] === 'string') {
    //   throw new Bad_Request(errors[0])
    // } else {
    //   throw errors[0]
    // }

  }
}