import * as express from "express"
import {initialize_endpoints} from "./api"

export class Server {
  private app

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

  start(port:number) {
    start_express(this.app, port)
  }

  get_app() {
    return this.app
  }
}

export function start_express(app: express.Application, port) {
  return new Promise<void>((resolve, reject) => {
    app.listen(port, function(err) {
      if (err)
        reject("Error starting server")

      console.log('API is listening on port ' + port)
      resolve()
    })
  })
}
