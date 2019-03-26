import {
  deferTransform,
  defineEndpoints,
  HttpError,
  LawnRequest,
  logErrorToConsole,
  Method,
  pipe,
  PromiseOrVoid,
  RequestListener,
  RequestTransform,
  SimpleResponse,
  transformEndpoint,
  applyVersioning
} from '../../src'

require('source-map-support').install()

class CustomRequestListener implements RequestListener {

  onRequest(request: LawnRequest<any>, response: SimpleResponse, res: any): PromiseOrVoid {
    return
  }

  onError(error: HttpError, request?: LawnRequest<any>): PromiseOrVoid {
    logErrorToConsole(error)
    return
  }
}

describe('endpoint test', function () {

  it('can define endpoints', function () {
    const dummyConversion: RequestTransform<any> = request => ({ ...request, data: { ...request.data, a: 'rabbit' } })
    const dummyConversion2: RequestTransform<any> = request => ({ ...request, data: { ...request.data, b: 'bird' } })
    const preprocessor = pipe([
      applyVersioning([1, 2]),
      dummyConversion
    ])

    const primaryEndpoints = defineEndpoints(deferTransform(preprocessor), [
      {
        method: Method.get,
        path: 'somewhere',
        handler: async request => ({})
      },
      {
        method: Method.post,
        path: 'somewhere',
        handler: async request => ({})
      }
    ])

    const secondaryEndpoints = defineEndpoints(deferTransform(pipe([preprocessor, dummyConversion2])), [
      {
        method: Method.get,
        path: 'nowhere',
        handler: async request => ({})
      },
      {
        method: Method.get,
        path: 'elsewhere',
        handler: async request => ({})
      },
    ])

    const endpoints = primaryEndpoints.concat(secondaryEndpoints)
      .map(transformEndpoint({ onResponse: new CustomRequestListener() }))
  })
})