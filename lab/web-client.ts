const axios = require('axios').default
const axiosCookieJarSupport = require('axios-cookiejar-support').default
const tough = require('tough-cookie')

axiosCookieJarSupport(axios)
const cookieJar = new tough.CookieJar()

axios.defaults.jar = true
axios.defaults.withCredentials = true

export class WebClient {
  url: string

  constructor(url: string) {
    this.url = url
  }

  private async request(method: string, path: string, params?: { [queryParameter: string]: any }, data?: any): Promise<any> {
    return axios.request({
      method: method,
      url: this.url + '/' + path,
      params: params,
      data: data,
    })
      .then((response: any) => response.data)
      .catch((error: any) => {
        console.log(error)
        return error
      })
  }

  async get(path: string, params?: any): Promise<any> {
    return this.request('get', path, params, undefined)
  }

  async post(path: string, data: any = {}): Promise<any> {
    return this.request('post', path, undefined, data)
  }

  async put(path: string, data: any): Promise<any> {
    return this.request('put', path, undefined, data)
  }

  async patch(path: string, data: any): Promise<any> {
    return this.request('patch', path, undefined, data)
  }

}
