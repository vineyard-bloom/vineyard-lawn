"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    request(method, path, params, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return axios.request({
                method: method,
                url: this.url + '/' + path,
                params: params,
                data: data,
            })
                .then((response) => response.data)
                .catch((error) => {
                console.log(error);
                return error;
            });
        });
    }
    get(path, params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('get', path, params, undefined);
        });
    }
    post(path, data = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('post', path, undefined, data);
        });
    }
    put(path, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('put', path, undefined, data);
        });
    }
    patch(path, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('patch', path, undefined, data);
        });
    }
}
exports.WebClient = WebClient;
//# sourceMappingURL=web-client.js.map