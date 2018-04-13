const promiseRequest = require('./request-promise')
const request =  require('request')

export class WebClient {
  url: string
  jar: any

  constructor(url: string) {
    this.url = url;
    this.jar = request.jar()
  }

  private request(method: string, path: string, params: any, data: any) {
    return promiseRequest({
      method: method,
      url: this.url + '/' + path,
      qs: params,
      body: data,
      json: true,
      jar: this.jar,
    })
  }

  get(path: string, params?: any) {
    let paramString = ''

    if (params && Object.keys(params).length > 0) {
      const array: string[] = []
      for (let i in params) {
        array.push(i + '=' + params[i])
      }
      paramString = '?' + array.join('&')
    }

    return this.request('get', path, params, null)
  }

  post(path: string, data: any = {}) {
    return this.request('post', path, null, data)
  }

  put(path: string, data: any) {
    return this.request('put', path, null, data)
  }

  patch(path: string, data: any) {
    return this.request('patch', path, null, data)
  }

}