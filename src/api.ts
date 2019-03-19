import * as express from 'express'
import { handleError, HttpError } from './errors'
import { Version } from './versioning'
import {
  DeferredRequestTransform,
  Endpoint,
  LawnHandler,
  LawnRequest,
  Method,
  PromiseOrVoid,
  RequestListener,
  SimpleResponse
} from './types'

const bodyParser = require('body-parser')

const jsonTemp = bodyParser.json()
const jsonParser = function (req: any, res: any, next: any) {
  jsonTemp(req, res, next)
}

export function logErrorToConsole(error: HttpError) {
  if (!error.stack)
    console.error('Error', error.status, error.message)
  else
    console.error('Error', error.status, error.stack)
}

class DefaultRequestListener implements RequestListener {

  onRequest(request: LawnRequest, response: SimpleResponse, res: any): PromiseOrVoid {
    return
  }

  onError(error: HttpError, request?: LawnRequest): PromiseOrVoid {
    logErrorToConsole(error)
    return
  }
}

export class EmptyRequestListener implements RequestListener {

  onRequest(request: LawnRequest, response: SimpleResponse, res: any): PromiseOrVoid {
    return
  }

  onError(error: HttpError, request?: LawnRequest): PromiseOrVoid {
    return
  }
}

const defaultRequestListener = new DefaultRequestListener()

// This function is currently modifying req.body for performance though could be changed if it ever caused problems.
function getArguments(req: express.Request) {
  const result = req.body || {}
  for (let i in req.query) {
    result[i] = req.query[i]
  }
  return result
}

function formatRequest(req: express.Request): LawnRequest {
  const data = getArguments(req)

  const request: LawnRequest = {
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

function logRequest(request: LawnRequest, listener: RequestListener, response: SimpleResponse, req: express.Request) {
  try {
    listener.onRequest(request, response, req)
  } catch (error) {
    console.error('Error while logging request', error)
  }
}

export function createExpressHandler(endpoint: Endpoint): express.RequestHandler {
  const onResponse = endpoint.onResponse || defaultRequestListener

  return async function (req: express.Request, res: express.Response) {
    let request: any

    try {
      request = formatRequest(req)
    } catch (error) {
      console.error('Error in early request handling stages will result in a missing request log.', error)
      handleError(res, error, onResponse, undefined)
      return
    }

    try {
      const content = await endpoint.handler(request)
      res.json(content)
      logRequest(request, onResponse, {
        code: 200,
        message: '',
        body: content
      }, req)
    } catch (error) {
      handleError(res, error, onResponse, request)
      if (!request.version)
        request.version = new Version(0, 0, 'error')

      logRequest(request, onResponse, {
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
      break

    case Method.post:
      app.post(path, [jsonParser].concat(middleware), handler)
      break

    case Method.patch:
      app.patch(path, [jsonParser].concat(middleware), handler)
      break

    case Method.put:
      app.put(path, [jsonParser].concat(middleware), handler)
      break

    case Method.delete:
      app.delete(path, [jsonParser].concat(middleware), handler)
      break
  }
}

export function attachHandler(app: express.Application, endpoint: Endpoint, handler: any) {
  let path = endpoint.path
  if (path [0] != '/')
    path = '/' + path

  const middleware = endpoint.middleware || []
  registerHttpHandler(app, path, endpoint.method, handler, middleware)
  registerHttpHandler(app, '/:version' + path, endpoint.method, handler, middleware)
}

export const attachEndpoint = (app: express.Application) => (endpoint: Endpoint) => {
  const handler = createExpressHandler(endpoint)
  attachHandler(app, endpoint, handler)
}

/**
 *
 * @param app  Express app object to attach the new endpoints
 *
 * @param endpoints  Array of endpoint definitions to create
 *
 */
export function createEndpoints(app: express.Application, endpoints: Endpoint[]) {
  endpoints.forEach(attachEndpoint(app))
}

function wrapLawnHandler(preprocessor: DeferredRequestTransform, handler: LawnHandler): LawnHandler {
  return (request: any) => preprocessor(request).then(request => handler(request))
}

/**
 *
 * @param requestTransform  A function to be run before the handler
 *
 */
export const wrapEndpoint = (requestTransform: DeferredRequestTransform) => (endpoint: Endpoint) =>
  ({ ...endpoint, handler: wrapLawnHandler(requestTransform, endpoint.handler) })

export function deferTransform<A, B>(transform: (t: A) => B): (t: A) => Promise<B> {
  return async request => transform(request)
}

export const transformEndpoint = (overrides: Partial<Endpoint>) => (endpoint: Endpoint) =>
  ({ ...endpoint, overrides })

export type Transform<T> = (t: T) => T
export type AsyncTransform<T> = (t: T) => Promise<T>

export function pipe<T>(transforms: Transform<T>[]): Transform<T> {
  return original => transforms.reduce((a, b) => b(a), original)
}

export function pipeAsync<T>(transforms: AsyncTransform<T>[]): AsyncTransform<T> {
  if (transforms.length == 0)
    return async request => request

  return async request => {
    let result = request
    for (const transform of transforms) {
      result = await transform(result)
    }
    return result
  }
}

export const defineEndpoints = (requestTransform: DeferredRequestTransform, endpoints: Endpoint[]) =>
  endpoints.map(wrapEndpoint(requestTransform))

export function setEndpointListener(onResponse: RequestListener) {
  return transformEndpoint({ onResponse })
}