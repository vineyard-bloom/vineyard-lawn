import * as express from "express"
import {createEndpoints} from "./api"
import {EndpointInfo, RequestListener, DeferredRequestTransform} from "./types"

export interface SSLConfig {
  enabled?: boolean
  publicFile?: string
  privateFile?: string
}

export interface ServerConfig {
  port?: number
  ssl?: SSLConfig
}

export class Server {
  readonly app: any
  private nodeServer: any
  private port: number = 3000
  readonly requestListener?: RequestListener

  /**
   * @param requestListener   Callback fired any time a request is received
   */
  constructor(requestListener?: RequestListener) {
    this.app = express()
    this.requestListener = requestListener
  }

  /**
   * Main function to create one or more endpoints.
   *
   * @param preprocessor  Function to call before each endpoint handler
   *
   * @param endpoints  Array of endpoint definitions
   *
   */
  createEndpoints(preprocessor: DeferredRequestTransform, endpoints: EndpointInfo[]) {
    createEndpoints(this.app, endpoints, preprocessor, this.requestListener)
  }

  /**
   * Enables wildcard CORS for this server.
   */
  enableCors() {
    this.app.use(require('cors')({
      origin: function (origin: any, callback: any) {
        callback(undefined, true)
      },
      credentials: true
    }))
  }

  /**
   * Starts listening for HTTP requests.
   */
  start(config: ServerConfig): Promise<void> {
    this.port = (config && config.port) || 3000
    return startExpress(this.app, this.port, config.ssl || {})
      .then(server => {
        this.nodeServer = server
        console.log('Listening on port ' + this.port + '.')
      })
  }

  /**
   * Gets the Server's internal Express app.
   */
  getApp() {
    return this.app
  }

  /**
   * Gets the listening HTTP port.
   */
  getPort(): number {
    return this.port
  }

  /**
   * Stops the server.
   */
  stop(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.nodeServer.close(() => resolve())
    })
  }
}

export function startExpress(app: express.Application, port: number, ssl: SSLConfig): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    try {
      if (ssl.enabled) {
        const https = require('https')
        const fs = require('fs')
        let privateCert, publicCert
        try {
          privateCert = fs.readFileSync(ssl.privateFile)
          publicCert = fs.readFileSync(ssl.publicFile)
        }
        catch (error) {
          console.error('Error loading ssl cert file.', error)
          reject(error)
        }
        const server = https.createServer({
          key: privateCert,
          cert: publicCert
        }, app)
          .listen(port, function (err: Error) {
            if (err)
              reject("Error starting server (SSL)")

            console.log('API is listening on port ' + port + ' (SSL)')
            resolve(server)
          })
      }
      else {
        const server = app.listen(port, function (err: Error) {
          if (err)
            reject("Error starting server")

          console.log('API is listening on port ' + port)
          resolve(server)
        })
      }
    }
    catch (error) {
      reject(error)
    }
  })
}
