import {VersionPreprocessor} from "../../source/version-preprocessor";

require('source-map-support').install()
import * as assert from 'assert'
import {Server} from "../../source/server";
import {Method} from "../../source/index";
import {Version} from "../../source/version";

const request_original = require('request').defaults({jar: true, json: true})
const axios = require('axios')

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
    server.createEndpoints(Promise.resolve, [
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
        assert(false, 'Should have thrown an error')
      })
      .catch(error => {
        assert.equal(1, error.body.errors.length)
        assert.equal('Missing property "weapon"', error.body.errors[0])
      })
  })

  it('wrong property type', function () {
    return local_request('post', 'test', {weapon: 640})
      .then(result => {
        assert(false, 'Should have thrown an error')
      })
      .catch(error => {
        assert.equal(1, error.body.errors.length)
        assert.equal('Property "weapon" should be a string', error.body.errors[0])
      })
  })

  after(function () {
    return server.stop()
  })
})

describe('versioning test', function () {
  let server
  this.timeout(9000)

  function local_request(method: string, url: string, body?: any) {
    return request({
      url: "http://localhost:3000/" + url,
      method: method,
      body: body
    })
  }

  it('simple version', async function () {
    server = new Server()
    const validators = server.compileApiSchema(require('../source/api.json'))
    const versionPreprocessor = new VersionPreprocessor([new Version(1)])
    server.createEndpoints(r => versionPreprocessor.simpleVersion(r), [
      {
        method: Method.post,
        path: "test",
        action: (request: any) => Promise.resolve({message: 'success'}),
        validator: validators.none
      },
    ])
    await server.start({})

    const result = await local_request('post', 'v1/test')
    assert.equal(result.message, 'success')
  })
})

describe('versioning-test', function () {

  it('version parsing', function () {
    {
      const version = new Version(1)
      assert.equal(version.major, 1)
      assert.equal(version.minor, 0)
      assert.equal(version.platform, 'none')
    }

    {
      const version = new Version('1')
      assert.equal(version.major, 1)
    }

    {
      const version = new Version('1.2.beta')
      assert.equal(version.major, 1)
      assert.equal(version.minor, 2)
      assert.equal(version.platform, 'beta')
    }
  })
})
