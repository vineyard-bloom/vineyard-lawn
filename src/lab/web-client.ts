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
    try {
      const response = await axios.request({
        method: method,
        url: this.url + '/' + path,
        params: params,
        data: data,
        validateStatus: (status: number) => status == 200 || status == 400 // The only two response types that lawn normally returns data with
      })
      return response.data
    } catch (error) {
      // console.log(error)
      return {error}
    }
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

  async delete(path: string): Promise<any> {
    return this.request('delete', path, undefined)
  }

}
