import * as express from "express"
import {initialize_endpoints} from "./api"

export interface Server_Config {
  port?: number
}

export class Server {
  private app
  private node_server
  private port: number = 3000

  constructor() {
    this.app = express()
  }

  add_endpoints(endpoints) {
    initialize_endpoints(this.app, endpoints)
  }

  enable_cors() {
    this.app.use(require('cors')({
      origin: function(origin, callback) {
        console.log('cors', origin)
        callback(null, true)
      },
      credentials: true
    }))
  }

  start(config: Server_Config): Promise<void> {
    this.port = (config && config.port) || 3000
    return start_express(this.app, this.port)
      .then(server => this.node_server = server)
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
