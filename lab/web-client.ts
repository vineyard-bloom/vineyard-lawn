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

  private request(method: string, path: string, params: any, data: any) {
    return axios.request({
      method: method,
      url: this.url + '/' + path,
      params: params,
      data: data,
    })
      .then(response => response.data)
      .catch(console.error)
  }

  get(path: string, params?: any) {
    // If statement outputs a string, Axios needs an object
    // let paramString = ''

    // if (params && Object.keys(params).length > 0) {
    //   const array: string[] = []
    //   for (let i in params) {
    //     array.push(i + '=' + params[i])
    //   }
    //   paramString = '?' + array.join('&')
    // }

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
