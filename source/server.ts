import * as express from "express"
import {create_endpoints, Request_Processor} from "./api"

export interface Server_Config {
  port?: number
}

export class Server {
  private app
  private node_server
  private port: number = 3000
  private default_preprocessor = null

  constructor(default_preprocessor?:Request_Processor) {
    this.app = express()
    this.default_preprocessor = default_preprocessor
  }

  add_endpoints(endpoints, preprocessor?: Request_Processor) {
    create_endpoints(this.app, endpoints, preprocessor || this.default_preprocessor)
  }

  enable_cors() {
    this.app.use(require('cors')({
      origin: function(origin, callback) {
        callback(null, true)
      },
      credentials: true
    }))
  }

  start(config: Server_Config): Promise<void> {
    this.port = (config && config.port) || 3000
    return start_express(this.app, this.port)
      .then(server => {
        this.node_server = server
        console.log('Listening on port ' + this.port + '.')
      })
  }

  get_app() {
    return this.app
  }

  get_port(): number {
    return this.port
  }

  stop() {
    this.node_server.close()
  }
}

export function start_express(app: express.Application, port): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    const server = app.listen(port, function(err) {
      if (err)
        reject("Error starting server")

      console.log('API is listening on port ' + port)
      resolve(server)
    })
  })
}
