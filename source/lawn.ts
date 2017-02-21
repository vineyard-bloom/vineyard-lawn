// Vineyard Lawn
// version 0.1.0
// created by Christopher W. Johnson

import * as express from "express"

export enum Method {
  get,
  post
}

export type Response_Generator = (request: express.Request) => Promise<any>

export interface Endpoint_Info {
  method: Method
  action: Response_Generator
}

// Lawn will handle any type of thrown errors, but also provides these helper Error types.

export class HTTP_Error extends Error {
  status: number

  constructor(message: string = "Server Error", status: number = 500) {
    super(message)
    this.status = status
  }
}

export class Bad_Request extends HTTP_Error {

  constructor(message: string = "Bad request") {
    super(message, 400)
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

export function handle_error(res, error) {
  const status = error.status || 500
  console.error("Error", status, error.message)
  const message = status == 500 ? "Server Error" : error.message
  res.status(status).send({
    message: message
  })
}

export function create_handler(endpoint: Endpoint_Info) {
  return function(req, res) {
    try {
      endpoint.action(req)
        .then(function(content) {
            res.send(content)
          },
          function(error) {
            handle_error(res, error)
          })
    }
    catch (error) {
      handle_error(res, error)
    }
  }
}

export function attach_handler(app: express.Application, method: Method, route: string, handler) {
  const method_function = method == Method.get ? 'get' : 'post'
  app[method_function](route, handler)
}

// initialize_endpoints() is the primary entry point
export function initialize_endpoints(app: express.Application, endpoints: { [route: string]: Endpoint_Info; }) {
  for (let route in endpoints) {
    const endpoint = endpoints [route]
    const handler = create_handler(endpoint)
    attach_handler(app, endpoint.method, route, handler)
  }
}