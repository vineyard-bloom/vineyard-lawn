import {Request, RequestListener} from './types'
import {HTTP_Error} from "./errors";

export function sendErrorResponse(res: any, error: HTTP_Error) {
  const message = error.message = error.status == 500 ? "Server Error" : error.message
  res.statusMessage = message
  const body: any = {
    message: error.message,
    errors: error.body.errors
  }

  res.status(error.status).send(body)
}

export function handleError(res: any, error: HTTP_Error, listener: RequestListener, request?: Request) {
  error.status = error.status || 500

  try {
    listener.onError(error, request || undefined)
  }
  catch (error) {
    console.error('Error while logging http handling error', error)
  }
  return sendErrorResponse(res, error)
}
