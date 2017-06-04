export type PromiseOrVoid = Promise<any> | null
import {Version} from "./version";

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
  version: Version
  startTime?
}

export interface SimpleResponse {
  code: number
  message: string
  body: any
}

export interface RequestListener {
  onRequest(request: Request, response:SimpleResponse, req): PromiseOrVoid
  onError(error ,request?: Request): PromiseOrVoid
}