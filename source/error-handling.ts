let logErrors = true

export function setErrorLogging(value: boolean) {
  logErrors = value
}

export function handleError(res, error) {
  const status = error.status || 500

  if (logErrors) {
    if (!error.stack)
      console.error("Error", status, error.message)
    else
      console.error("Error", status, error.stack)
  }

  const message = status == 500 ? "Server Error" : error.message
  res.statusMessage = message
  const body:any = {
      error: {
        code: status,
        message: message
      }
    }
    
  if (error.body && (typeof error.body != 'object' || Object.keys(error.body).length > 0))
    body.additional = error.body

  res.status(status).send(body)
}
