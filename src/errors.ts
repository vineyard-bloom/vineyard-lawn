// Lawn will handle any type of thrown errors, but also provides these helper Error types.

import { LawnRequest, RequestListener } from './types'

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

export class HTTPError extends HttpError {
  constructor(message: string = "Server Error", status: number = 500, body = {}) {
    super(message, status, body)
  }
}

export type BodyOrString = Body | string

export class BadRequest extends HTTPError {
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

export class NeedsLogin extends HTTPError {

  constructor(message: string = "This request requires a logged in user.") {
    super(message, 401)
  }
}

export class Unauthorized extends HTTPError {

  constructor(message: string = "You are not authorized to perform this request.") {
    super(message, 403)
  }
}

export function sendErrorResponse(res: any, error: HttpError) {
  const message = error.message = error.status == 500 ? "Server Error" : error.message
  res.statusMessage = message
  error.body = error.body || {}
  const body: any = {
    message: error.message,
    errors: error.body.errors
  }

  res.status(error.status).send(body)
}

export function handleError(res: any, error: HttpError, listener: RequestListener, request?: LawnRequest) {
  error.status = error.status || 500

  try {
    listener.onError(error, request || undefined)
  }
  catch (error) {
    console.error('Error while logging http handling error', error)
  }
  return sendErrorResponse(res, error)
}