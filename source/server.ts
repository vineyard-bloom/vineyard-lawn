import * as express from "express"
import {create_endpoints} from "./api"
import {Endpoint_Info, RequestListener, Request_Processor, ValidationCompiler} from "./types"

export interface SSLConfig {
  enabled?: boolean
  publicFile?: string
  privateFile?: string
}

export interface ServerConfig {
  port?: number
  ssl?: SSLConfig
}

export type Server_Config = ServerConfig

export class Server implements ValidationCompiler {
  private app: any
  private node_server: any
  private port: number = 3000
  private default_preprocessor?: Request_Processor
  private ajv?: any
  private requestListener?: RequestListener

  /**
   * @param defaultPreprocessor  Deprecated
   * @param requestListener   Callback fired any time a request is received
   */
  constructor(defaultPreprocessor?: Request_Processor, requestListener?: RequestListener) {
    this.app = express()
    this.default_preprocessor = defaultPreprocessor
    this.requestListener = requestListener

    // Backwards compatibility
    const self: any = this
    self.get_app = this.getApp
    self.get_port = this.getPort
    self.enable_cors = this.enableCors
    self.add_endpoints = (endpoints: Endpoint_Info[], preprocessor: Request_Processor) => {
      create_endpoints(this.app, endpoints, preprocessor, this.ajv, this.requestListener)
    }
  }

  private checkAjv() {
    if (!this.ajv) {
      const Ajv = require('ajv')
      this.ajv = new Ajv({allErrors: true})
    }
  }

  /**
   * Compiles an API vaidation schema using ajv.
   */
  compileApiSchema(schema: any) {
    this.checkAjv()

    const result: any = {}
    for (let i in schema) {
      const entry = schema[i]
      if (entry.additionalProperties !== true && entry.additionalProperties !== false)
        entry.additionalProperties = false

      result [i] = this.ajv.compile(schema[i])
    }

    return result
  }

  /**
   * Adds an API validation schema to the Server's ajv instance.
   */
  addApiSchemaHelper(schema: any) {
    this.checkAjv()
    this.ajv.addSchema(schema)
  }

  /**
   * Returns the Server's ajv instance.
   */
  getApiSchema() {
    this.checkAjv()
    return this.ajv
  }

  /**
   * Main function to create one or more endpoints.
   */
  createEndpoints(preprocessor: Request_Processor, endpoints: Endpoint_Info[]) {
    create_endpoints(this.app, endpoints, preprocessor, this.ajv, this.requestListener)
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
  start(config: Server_Config): Promise<void> {
    this.port = (config && config.port) || 3000
    return start_express(this.app, this.port, config.ssl || {})
      .then(server => {
        this.node_server = server
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
      this.node_server.close(() => resolve())
    })
  }
}

export function start_express(app: express.Application, port: number, ssl: SSLConfig): Promise<any> {
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
