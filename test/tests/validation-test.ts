import * as assert from 'assert'
import {Server} from "../../source/server";
import {Method} from "../../source/index";

require('source-map-support').install()

const request_original = require('request').defaults({jar: true, json: true})

function request(options: any): Promise<any> {
  return new Promise(function (resolve, reject) {
    request_original(options, function (error: Error | undefined, response: any, body: any) {
      const options2 = options
      if (error)
        reject(error)
      else if (response.statusCode != 200) {
        const error: any = new Error(response.statusCode + " " + response.statusMessage)
        error.body = response.body
        reject(error)
      }
      else
        resolve(body)
    })
  })
}

describe('validation test', function () {
  let server
  this.timeout(5000)

  function local_request(method: string, url: string, body?: any) {
    return request({
      url: "http://localhost:3000/" + url,
      method: method,
      body: body
    })
  }

  function login(username: string, password: string) {
    return local_request('post', 'user/login', {
      username: username,
      password: password
    })
  }

  before(function () {
    server = new Server()
    const validators = server.compileApiSchema(require('../source/api.json'))
    server.createEndpoints([
      {
        method: Method.post,
        path: "test",
        action: (request: any) => Promise.resolve(),
        validator: validators.test
      },
    ])

    return server.start({})
  })

  it('missing required', function () {
    return local_request('post', 'test')
      .then(result => {
        assert(false, 'Should have thrown an error.')
      })
      .catch(error => {
        assert.equal(1, error.body.errors.length)
        assert.equal('Missing property "weapon".', error.body.errors[0])
      })
  })

  it('wrong property type', function () {
    return local_request('post', 'test', {
      weapon: 640
    })
      .then(result => {
        assert(false, 'Should have thrown an error.')
      })
      .catch(error => {
        assert.equal(1, error.body.errors.length)
        assert.equal('Property "weapon" should be a string.', error.body.errors[0])
      })
  })

})