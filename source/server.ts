import * as express from "express"
import {create_endpoints, Request_Processor, Endpoint_Info} from "./api"
import {RequestListener, ValidationCompiler} from "./types"

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

  constructor(default_preprocessor?: Request_Processor, requestedListener?: RequestListener) {
    this.app = express()
    this.default_preprocessor = default_preprocessor
    this.requestListener = requestedListener

    // Backwards compatibility
    const self: any = this
    self.get_app = this.getApp
    self.get_port = this.getPort
    self.enable_cors = this.enableCors
  }

  private checkAjv() {
    if (!this.ajv) {
      const Ajv = require('ajv')
      this.ajv = new Ajv()
    }
  }

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

  addApiSchemaHelper(schema: any) {
    this.checkAjv()
    this.ajv.addSchema(schema)
  }

  getApiSchema() {
    this.checkAjv()
    return this.ajv
  }

  createEndpoints(preprocessor: Request_Processor, endpoints: Endpoint_Info[]) {
    create_endpoints(this.app, endpoints, preprocessor, this.ajv, this.requestListener)
  }

  add_endpoints(endpoints: Endpoint_Info[], preprocessor: Request_Processor) {
    create_endpoints(this.app, endpoints, preprocessor, this.ajv, this.requestListener)
  }

  enableCors() {
    this.app.use(require('cors')({
      origin: function (origin: any, callback: any) {
        callback(undefined, true)
      },
      credentials: true
    }))
  }

  start(config: Server_Config): Promise<void> {
    this.port = (config && config.port) || 3000
    return start_express(this.app, this.port, config.ssl || {})
      .then(server => {
        this.node_server = server
      })
  }

  getApp() {
    return this.app
  }

  getPort(): number {
    return this.port
  }

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
