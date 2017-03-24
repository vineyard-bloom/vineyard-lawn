// Vineyard Lawn
// version 0.1.0
// created by Christopher W. Johnson

import * as express from "express"
import * as body_parser from 'body-parser'
export * from './errors'

// const json_parser = body_parser.json()
const json_temp = body_parser.json()
const json_parser = function(req, res, next) {
  json_temp(req, res, next)
}
export enum Method {
  get,
  post
}

export type Promise_Or_Void = Promise<void> | void
export type Response_Generator = (request: Request) => Promise<any>
export type Filter = (request: Request) => Promise_Or_Void

export interface Endpoint_Info {
  method: Method
  path: string
  action: Response_Generator
  middleware?: any[]
  filter?: Filter
}

export interface Optional_Endpoint_Info {
  method?: Method
  path?: string
  action?: Response_Generator
  middleware?: any[]
  filter?: Filter
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
      const request = {
        data: get_arguments(req)
      }
      endpoint.action(request)
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

export function attach_handler(app: express.Application, endpoint: Endpoint_Info, handler) {
  let path = endpoint.path
  if (path [0] != '/')
    path = '/' + path

  const middleware = endpoint.middleware || []
  if (endpoint.method == Method.get) {
    app.get(path, middleware, handler)
  }
  else {
    app.post(path, [json_parser].concat(middleware), handler)
  }

}

export function create_endpoint(app: express.Application, endpoint: Endpoint_Info) {
  const handler = create_handler(endpoint)
  attach_handler(app, endpoint, handler)
}

export function create_endpoint_with_defaults(app: express.Application, endpoint_defaults: Optional_Endpoint_Info,
                                              endpoint: Optional_Endpoint_Info) {
  create_endpoint(app, Object.assign({}, endpoint_defaults, endpoint))
}

export function create_endpoints(app: express.Application, endpoints: Endpoint_Info[]) {
  for (let endpoint of endpoints) {
    create_endpoint(app, endpoint)
  }
}
