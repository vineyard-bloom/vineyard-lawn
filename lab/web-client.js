"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios = require('axios').default;
var axiosCookieJarSupport = require('axios-cookiejar-support').default;
var tough = require('tough-cookie');
axiosCookieJarSupport(axios);
var cookieJar = new tough.CookieJar();
axios.defaults.jar = true;
axios.defaults.withCredentials = true;
var WebClient = /** @class */ (function () {
    function WebClient(url) {
        this.url = url;
    }
    WebClient.prototype.request = function (method, path, params, data) {
        return axios.request({
            method: method,
            url: this.url + '/' + path,
            params: params,
            data: data,
        })
            .then(function (response) { return response.data; })
            .catch(console.error);
    };
    WebClient.prototype.get = function (path, params) {
        // If statement outputs a string, Axios needs an object
        // let paramString = ''
        // if (params && Object.keys(params).length > 0) {
        //   const array: string[] = []
        //   for (let i in params) {
        //     array.push(i + '=' + params[i])
        //   }
        //   paramString = '?' + array.join('&')
        // }
        return this.request('get', path, params, null);
    };
    WebClient.prototype.post = function (path, data) {
        if (data === void 0) { data = {}; }
        return this.request('post', path, null, data);
    };
    WebClient.prototype.put = function (path, data) {
        return this.request('put', path, null, data);
    };
    WebClient.prototype.patch = function (path, data) {
        return this.request('patch', path, null, data);
    };
    return WebClient;
}());
exports.WebClient = WebClient;
//# sourceMappingURL=web-client.js.map