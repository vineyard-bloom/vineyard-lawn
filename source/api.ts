import * as express from "express"

const body_parser = require('body-parser')
import {validate} from "./validation"
import {handleError} from "./error-handling"
import {Version} from "./version"
import {
  Endpoint_Info, 
  Filter,
  Method, 
  Optional_Endpoint_Info,
  PromiseOrVoid, 
  Request, 
  RequestListener, 
  Request_Processor, 
  Response_Generator,
  SimpleResponse
} from "./types"
import {Bad_Request, HTTP_Error} from "./errors";

const json_temp = body_parser.json()
const json_parser = function (req: any, res: any, next: any) {
  json_temp(req, res, next)
}


export function logErrorToConsole(error: HTTP_Error) {
  if (!error.stack)
    console.error("Error", error.status, error.message)
  else
    console.error("Error", error.status, error.stack)
}

class DefaultRequestListener implements RequestListener {

  onRequest(request: Request, response: SimpleResponse, res: any): PromiseOrVoid {
    return
  }

  onError(error: HTTP_Error, request?: Request): PromiseOrVoid {
    logErrorToConsole(error)
    return
  }
}

// This function is currently modifying req.body for performance though could be changed if it ever caused problems.
function get_arguments(req: express.Request) {
  const result = req.body || {}
  for (let i in req.query) {
    result[i] = req.query[i]
  }
  return result
}

function getVersion(req: any, data: any): Version | undefined {
  if (typeof req.params.version === 'string') {
    return new Version(req.params.version)
  }
  else if (typeof data.version === 'string') {
    const version = new Version(data.version)
    delete data.version
    return version
  }
  return undefined
}

function formatRequest(req: any): Request {
  const data = get_arguments(req)

  const request: Request = {
    data: data,
    session: req.session,
    version: undefined,
    original: req,
    startTime: new Date().getTime()
  }
  if (req.params)
    request.params = req.params

  return request
}

function logRequest(request: Request, listener: RequestListener, response: SimpleResponse, req: any) {
  try {
    listener.onRequest(request, response, req)
  }
  catch (error) {
    console.error('Error while logging request', error)
  }
}

export function create_handler(endpoint: Endpoint_Info, action: any, ajv: any, listener: RequestListener) {
  if (endpoint.validator && !ajv)
    throw new Error("Lawn.create_handler argument ajv cannot be undefined when endpoints have validators.")

  return function (req: any, res: any) {
    let request: any

    try {
      request = formatRequest(req)
    }
    catch (error) {
      console.error('Error in early request handling stages will result in a missing request log.', error)
      handleError(res, error, listener, undefined)
      return
    }

    try {
      request.version = getVersion(req, request.data)

      if (endpoint.validator)
        validate(endpoint.validator, request.data, ajv)

      action(request)
        .then(function (content: any) {
            res.send(content)
            logRequest(request, listener, {
              code: 200,
              message: "",
              body: content
            }, req)
          },
          function (error: HTTP_Error) {
            handleError(res, error, listener, request)
            logRequest(request, listener, {
              code: error.status,
              message: error.message,
              body: error.body
            }, req)
          })
    }
    catch (error) {
      handleError(res, error, listener, undefined)
      if (!request.version)
        request.version = new Version(0, 0, 'error')

      logRequest(request, listener, {
        code: error.status,
        message: error.message,
        body: error.body
      }, req)
    }
  }
}

function register_http_handler(app: express.Application, path: string, method: Method, handler: any, middleware: any) {
  switch (method) {
    case Method.get:
      app.get(path, middleware, handler)
      break;

    case Method.post:
      app.post(path, [json_parser].concat(middleware), handler)
      break;

    case Method.put:
      app.put(path, [json_parser].concat(middleware), handler)
      break;

    case Method.delete:
      app.delete(path, [json_parser].concat(middleware), handler)
      break;
  }
}

export function attach_handler(app: express.Application, endpoint: Endpoint_Info, handler: any) {
  let path = endpoint.path
  if (path [0] != '/')
    path = '/' + path

  const middleware = endpoint.middleware || []
  register_http_handler(app, path, endpoint.method, handler, middleware)
  register_http_handler(app, '/:version' + path, endpoint.method, handler, middleware)
}

export function create_endpoint(app: express.Application, endpoint: Endpoint_Info,
                                preprocessor?: Request_Processor, ajv?: any,
                                listener: RequestListener = new DefaultRequestListener()) {
  const action = preprocessor
    ? (request: any) => preprocessor(request).then(request => endpoint.action(request))
    : endpoint.action

  const handler = create_handler(endpoint, action, ajv, listener)
  attach_handler(app, endpoint, handler)
}

export function create_endpoint_with_defaults(app: express.Application, endpoint_defaults: Optional_Endpoint_Info,
                                              endpoint: Optional_Endpoint_Info,
                                              preprocessor?: Request_Processor) {
  const info = Object.assign({}, endpoint_defaults, endpoint) as Endpoint_Info
  create_endpoint(app, info, preprocessor)
}

export function create_endpoints(app: express.Application, endpoints: Endpoint_Info[],
                                 preprocessor?: Request_Processor, ajv?: any,
                                 listener: RequestListener = new DefaultRequestListener()) {
  for (let endpoint of endpoints) {
    create_endpoint(app, endpoint, preprocessor, ajv, listener)
  }
}

export function createEndpoints(app: express.Application, endpoints: Endpoint_Info[],
                                preprocessor?: Request_Processor, ajv?: any,
                                listener: RequestListener = new DefaultRequestListener()) {
  return create_endpoints(app, endpoints, preprocessor, ajv, listener)
}
