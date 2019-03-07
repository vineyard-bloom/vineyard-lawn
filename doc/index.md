# Vineyard Lawn - Documentation

## Example Usage

Normally it is recommended to put handler functions in a separate file.  In this example handler functions are inlined for brevity.

```typescript
import * as express from 'express'
import {
  applyVersioning,
  BadRequest,
  createEndpoints,
  deferTransform,
  defineEndpoints,
  enableCors,
  Endpoint,
  LawnRequest,
  Method,
  pipeAsync,
  startExpress
} from 'vineyard-lawn'

async function authorize(request: LawnRequest) {
  ...
}

function initializeEndpoints(): Endpoint[] {

  const commonTransform = deferTransform(applyVersioning([1]))
  const privateTransform = pipeAsync([commonTransform, authorize])

  const publicEndpoints = defineEndpoints(commonTransform, [
    {
      method: Method.get,
      path: "adventure",
      handler: async request => ({ someData: 'blah' })
    },
    {
      method: Method.post,
      path: "adventure",
      handler: request => {
        if (!request.data.page)
          throw new BadRequest("Missing 'page' argument.")

        return { someData: 'page blah' }
      }
    },
  ])
  
  const privateEndpoints = defineEndpoints(privateTransform, [
    {
      method: Method.get,
      path: "top/secret",
      handler: request => ({ secretData: 'more blah' })
    },
  ])
  
  return publicEndpoints.concat(privateEndpoints)
}

async function main() {

  const endpoints = initializeEndpoints()
  const app = express()
  enableCors(app)   
  createEndpoints(app, endpoints)
  
  const config = require('../config/config.json')      
  const server = await startExpress(app, config.api)
}

main()
```

## Endpoint Data Types

### `enum` Method
* delete
* get
* post
* put
* patch

### `interface` Endpoint

#### Properties

* action `ResponseGenerator` Request handler function
* method `Method` HTTP Method
* middleware `any[]` Array of Express middleware to use just for this endpoint
* path `string` Relative endpoint path
* onResponse `RequestListener` Optional callback that is fired when the endpoint sends a response

## Endpoint Functions

### defineEndpoints

Attaches a request transform that is called before each endpoint in the array.

Parameters

* commonTransform `DeferredRequestTransform` Function to call before each endpoint handler

* endpoints `Endpoint[]` Array of endpoint definitions

Returns `Endpoint[]`

### createEndpoints

Creates multiple Express endpoints based on an array of Lawn endpoint definitions.

Parameters

* app `express.Application` an Express Application
* endpoints `Endpoint[]` Array of endpoint definitions

### startExpress

Starts an express server.  Simplifies SSL management.

Parameters
* app `express.Application` an Express Application
* config `ApiConfig` Object that sets port and SSL configuration
