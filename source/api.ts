import * as express from "express"

const body_parser = require('body-parser')
import {validate} from "./validation"
import {handleError} from "./error-handling"
import {Version} from "./version"
import {
  EndpointInfo,
  Method,
  PromiseOrVoid,
  Request, 
  RequestListener, 
  RequestProcessor,
  SimpleResponse
} from "./types"
import {HTTP_Error} from "./errors";

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
function getArguments(req: express.Request) {
  const result = req.body || {}
  for (let i in req.query) {
    result[i] = req.query[i]
  }
  return result
}

function formatRequest(req: any): Request {
  const data = getArguments(req)

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

export function createHandler(endpoint: EndpointInfo, action: any, ajv: any, listener: RequestListener) {
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

function registerHttpHandler(app: express.Application, path: string, method: Method, handler: any, middleware: any) {
  switch (method) {
    case Method.get:
      app.get(path, middleware, handler)
      break;

    case Method.post:
      app.post(path, [json_parser].concat(middleware), handler)
      break;

    case Method.patch:
      app.patch(path, [json_parser].concat(middleware), handler)
      break;

    case Method.put:
      app.put(path, [json_parser].concat(middleware), handler)
      break;

    case Method.delete:
      app.delete(path, [json_parser].concat(middleware), handler)
      break;
  }
}

export function attachHandler(app: express.Application, endpoint: EndpointInfo, handler: any) {
  let path = endpoint.path
  if (path [0] != '/')
    path = '/' + path

  const middleware = endpoint.middleware || []
  registerHttpHandler(app, path, endpoint.method, handler, middleware)
  registerHttpHandler(app, '/:version' + path, endpoint.method, handler, middleware)
}

export function createEndpoint(app: express.Application, endpoint: EndpointInfo,
                               preprocessor?: RequestProcessor, ajv?: any,
                               listener: RequestListener = new DefaultRequestListener()) {
  const action = preprocessor
    ? (request: any) => preprocessor(request).then(request => endpoint.action(request))
    : endpoint.action

  const handler = createHandler(endpoint, action, ajv, listener)
  attachHandler(app, endpoint, handler)
}

/**
 *
 * @param app  Express app object to attach the new endpoints
 *
 * @param endpoints  Array of endpoint definitions to create
 *
 * @param preprocessor  A function to be run before each endpoint handler
 *
 * @param ajv  Ajv object used for schema validation
 *
 * @param listener  Callback fired after each request in the endpoints is handled
 *
 */
export function createEndpoints(app: express.Application, endpoints: EndpointInfo[],
                                preprocessor?: RequestProcessor, ajv?: any,
                                listener: RequestListener = new DefaultRequestListener()) {
  for (let endpoint of endpoints) {
    createEndpoint(app, endpoint, preprocessor, ajv, listener)
  }
}

module.exports.create_endpoint = createEndpoint
module.exports.create_handler = createHandler
module.exports.attach_handler = attachHandler
module.exports.create_endpoints = createEndpoints
