"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios = require('axios').default;
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');
axiosCookieJarSupport(axios);
const cookieJar = new tough.CookieJar();
axios.defaults.jar = true;
axios.defaults.withCredentials = true;
class WebClient {
    constructor(url) {
        this.url = url;
    }
    async request(method, path, params, data) {
        try {
            const response = await axios.request({
                method: method,
                url: this.url + '/' + path,
                params: params,
                data: data,
                validateStatus: (status) => status < 500
            });
            return response.data;
        }
        catch (error) {
            // console.log(error)
            return { error };
        }
    }
    async get(path, params) {
        return this.request('get', path, params, undefined);
    }
    async post(path, data = {}) {
        return this.request('post', path, undefined, data);
    }
    async put(path, data) {
        return this.request('put', path, undefined, data);
    }
    async patch(path, data) {
        return this.request('patch', path, undefined, data);
    }
}
exports.WebClient = WebClient;
//# sourceMappingURL=web-client.js.map