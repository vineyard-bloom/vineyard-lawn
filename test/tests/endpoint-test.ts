import {
  EndpointInfo,
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
  versionRequestTransform,
  wrapEndpoint
} from '../../src'

require('source-map-support').install()

class CustomRequestListener implements RequestListener {

  onRequest(request: LawnRequest, response: SimpleResponse, res: any): PromiseOrVoid {
    return
  }

  onError(error: HttpError, request?: LawnRequest): PromiseOrVoid {
    logErrorToConsole(error)
    return
  }
}

describe('endpoint test', function () {

  it('can define endpoints', function () {
    const dummyConversion: RequestTransform = request => ({ ...request, data: { ...request.data, a: 'rabbit' } })
    const dummyConversion2: RequestTransform = request => ({ ...request, data: { ...request.data, b: 'bird' } })
    const preprocessor = pipe([
      versionRequestTransform([1, 2]),
      dummyConversion
    ])

    const primaryEndpoints: EndpointInfo[] = [
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
    ]

    const secondaryEndpoints: EndpointInfo[] = [
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
    ]

    const endpoints = primaryEndpoints.map(wrapEndpoint(preprocessor))
      .concat(
        secondaryEndpoints.map(wrapEndpoint(pipe([preprocessor, dummyConversion2])))
      )
      .map(transformEndpoint({ onResponse: new CustomRequestListener() }))
  })
})