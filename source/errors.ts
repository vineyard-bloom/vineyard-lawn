// Lawn will handle any type of thrown errors, but also provides these helper Error types.

export class HttpError extends Error {
  status: number
  body: any
  key: string = ''
  message: string

  constructor(message: string = "Server Error", status: number = 500, body = {}) {
    super(message)
    this.status = status
    this.message = message // super(message) doesn't seem to be working.
    this.body = body
  }

  toString() {
    return super.toString() + ' ' + JSON.stringify(this.body)
  }
}

export interface Body {
  key: string
  data?: any
  errors?: any[]
}

export class HTTP_Error extends HttpError {
  constructor(message: string = "Server Error", status: number = 500, body = {}) {
    super(message, status, body)
  }
}

export class HTTPError extends HttpError {
  constructor(message: string = "Server Error", status: number = 500, body = {}) {
    super(message, status, body)
  }
}

export type BodyOrString = Body | string

export class Bad_Request extends HTTP_Error {

  constructor(message: string = "Bad Request", bodyOrKey: BodyOrString = {key: ''}) {
    if (typeof bodyOrKey === 'string') {
      super(message, 400)
      this.key = bodyOrKey
    }
    else {
      super(message, 400, bodyOrKey)
      this.key = bodyOrKey.key
    }
  }
}

export class BadRequest extends HTTP_Error {

  constructor(message: string = "Bad Request", bodyOrKey: BodyOrString = {key: ''}) {
    if (typeof bodyOrKey === 'string') {
      super(message, 400)
      this.key = bodyOrKey
    }
    else {
      super(message, 400, bodyOrKey)
      this.key = bodyOrKey.key
    }
  }
}

export class Needs_Login extends HTTP_Error {

  constructor(message: string = "This request requires a logged in user.") {
    super(message, 401)
  }
}

export class Unauthorized extends HTTP_Error {

  constructor(message: string = "You are not authorized to perform this request.") {
    super(message, 403)
  }
}