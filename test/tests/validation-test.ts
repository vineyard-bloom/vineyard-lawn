import {VersionPreprocessor} from "../../source/version-preprocessor"
import {WebClient} from "../../lab"
const webClient = new WebClient('http://localhost:3000')

require('source-map-support').install()
import * as assert from 'assert'
import {Server} from "../../source/server"
import {Method} from "../../source/index"
import {Version} from "../../source/version"

const axios = require('axios').default
const axiosCookieJarSupport = require('axios-cookiejar-support').default
const tough = require('tough-cookie')

axiosCookieJarSupport(axios)
const cookieJar = new tough.CookieJar()

axios.defaults.jar = true
axios.defaults.withCredentials = true

describe('validation test', function () {
  let server
  this.timeout(5000)

  function local_request(method: string, url: string, data?: any) {
    return axios.request({
      url: "http://localhost:3000/" + url,
      method: method,
      data: data
    })
  }

  before(function () {
    server = new Server()
    const validators = server.compileApiSchema(require('../source/api.json'))
    server.createEndpoints(() => Promise.resolve(), [
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
        assert.equal(1, error.response.data.errors.length)
        assert.equal('Missing property "weapon"', error.response.data.errors[0])
      })
  })

  it('wrong property type', function () {
    return local_request('post', 'test', {weapon: 640})
      .then(result => {
        assert(false, 'Should have thrown an error')
      })
      .catch(error => {
        assert.equal(1, error.response.data.errors.length)
        assert.equal('Property "weapon" should be a string', error.response.data.errors[0])
      })
  })

  after(function () {
    return server.stop()
  })
})

describe('versioning test', function () {
  let server
  this.timeout(9000)

  function local_request(method: string, url: string, data?: any) {
    return axios.request({
      url: "http://localhost:3000/" + url,
      method: method,
      data: data
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
    assert.equal(result.data.message, 'success')
  })

  after(function () {
    return server.stop()
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

describe('API call test', function () {
  let server
  this.timeout(9000)

  before(function () {
    let data = 'Test data'
    server = new Server()
    server.createEndpoints(() => Promise.resolve(), [
      {
        method: Method.get,
        path: "test",
        action: (request: any) => Promise.resolve({data})
      },
      {
        method: Method.patch,
        path: "test",
        action: (request: any) => Promise.resolve({message: 'success'})
      },
    ])

    return server.start({})
  })

  it('handles a get request', async function () {
    const result = await webClient.get('test')
    assert.deepEqual({data: 'Test data'}, result)
  })

  it('handles a patch request', async function () {
    const result = await webClient.patch('test', {data: 'Some more data'})
    assert.deepEqual({message: 'success'}, result)
  })

  after(function () {
    return server.stop()
  })
})
