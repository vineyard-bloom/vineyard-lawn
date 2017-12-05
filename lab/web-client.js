"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promiseRequest = require('./request-promise');
class WebClient {
    constructor(url) {
        this.url = url;
    }
    request(method, path, params, data) {
        return promiseRequest({
            method: method,
            url: this.url + '/' + path,
            qs: params,
            body: data,
            json: true,
            jar: true,
        });
    }
    get(path, params) {
        let paramString = '';
        if (params && Object.keys(params).length > 0) {
            const array = [];
            for (let i in params) {
                array.push(i + '=' + params[i]);
            }
            paramString = '?' + array.join('&');
        }
        return this.request('get', path, params, null);
    }
    post(path, data = {}) {
        return this.request('post', path, null, data);
    }
    put(path, data) {
        return this.request('put', path, null, data);
    }
}
exports.WebClient = WebClient;
//# sourceMappingURL=web-client.js.map