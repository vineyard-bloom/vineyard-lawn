// Vineyard Lawn
// version 0.1.0
// created by Christopher W. Johnson

import * as express from "express"
import * as body_parser from 'body-parser'
export * from './errors'

// const json_parser = body_parser.json()
const json_temp = body_parser.json()
const json_parser = function (req, res, next) {
  json_temp(req, res, next)
}
export enum Method {
  get,
  post
}

// Having a hard time getting TypeScript to see 'Promise' in this project though it's working in identically configured
// projects.  For now just using 'any'.
// export type Response_Generator = (request: express.Request) => Promise<any>
export type Response_Generator = (args: any) => any

export interface Endpoint_Info {
  method: Method
  path: string
  action: Response_Generator
}

export function handle_error(res, error) {
  const status = error.status || 500
  console.error("Error", status, error.message)
  const message = status == 500 ? "Server Error" : error.message
  res.status(status).send({
    message: message
  })
}

// This function is currently modifying req.body for performance though could be changed if it ever caused problems.
function get_arguments(req: express.Request) {
  const result = req.body || {}
  for (let i in  req.query) {
    result[i] = req[i]
  }
  return result
}

export function create_handler(endpoint: Endpoint_Info) {
  return function(req, res) {
    try {
      endpoint.action(get_arguments(req))
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
  if (route [0] != '/')
    route = '/' + route

  if (method == Method.get) {
    app.get(route, handler)
  }
  else {
    app.post(route, json_parser, handler)
  }
}

// initialize_endpoints() is the primary entry point
export function initialize_endpoints(app: express.Application, endpoints: Endpoint_Info[]) {
  for (let endpoint of endpoints) {
    const handler = create_handler(endpoint)
    attach_handler(app, endpoint.method, endpoint.path, handler)
  }
}