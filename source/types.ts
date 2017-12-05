import {Version} from "./version";
import {ValidateFunction} from "ajv"

export enum Method {
  get,
  post,
  put,
  delete
}

export interface Request {
  data: any
  session: any
  user?: any
  params?: any
  version?: Version
  startTime?: any
  original?: any
}

export type PromiseOrVoid = Promise<void> | void
export type RequestProcessor = (request: Request) => Promise<Request>
export type ResponseGenerator = (request: Request) => Promise<any>

export interface SimpleResponse {
  code: number
  message: string
  body: any
}

export interface RequestListener {
  onRequest(request: Request, response: SimpleResponse, req: any): PromiseOrVoid
  onError(error: Error, request?: Request): PromiseOrVoid
}

export interface ValidationCompiler {
  compileApiSchema(schema: any): any
}

export interface EndpointInfo {

  /** HTTP Method */
  method: Method

  /** Relative endpoint path */
  path: string

  /** Request handler function */
  action: ResponseGenerator

  /** Array of Express middleware to use just for this endpoint */
  middleware?: any[]

  /** AJV schema validator function */
  validator?: ValidateFunction
}