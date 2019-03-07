import * as express from "express"

export interface SSLConfig {
  enabled?: boolean
  publicFile?: string
  privateFile?: string
}

export interface ApiConfig {
  port?: number
  ssl?: SSLConfig
}

export function enableCors(app: express.Application) {
  app.use(require('cors')({
    origin: function (origin: any, callback: any) {
      callback(undefined, true)
    },
    credentials: true
  }))
}

export function startExpress(app: express.Application, config: ApiConfig): Promise<any> {
  const {ssl} = config
  const port = config.port || 3000
  return new Promise<any>((resolve, reject) => {
    try {
      if (ssl && ssl.enabled) {
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
