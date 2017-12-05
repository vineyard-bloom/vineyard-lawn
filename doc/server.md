# Vineyard Lawn - Server Class

Lawn provides an optional Server class that wraps Lawn's core routing functions and streamlines spinning up an API server.

## Example usage

import * as lawn from 'vineyard-lawn'
const config = require('../config/config.json')

const server = new lawn.Server()
server.createEndpoints(...)
server.start(config.api)

## `Server` Class API

#### Constructor

Parameters

* *(optional)* defaultPreprocessor `RequestProcessor` 
* *(optional)* requestListener `RequestListener` 

Returns `Server`

#### Functions

##### `addApiSchemaHelper`
Adds an API validation schema to the Server's ajv instance.

Parameters

*  schema `any` 

Returns `void`

##### `compileApiSchema`
Compiles an API vaidation schema using ajv.

Parameters

*  schema `any` 

Returns `any`

##### `createEndpoints`
Main function to create one or more endpoints.

Parameters

*  preprocessor `RequestProcessor` Function to call before each endpoint handler

*  endpoints `EndpointInfo[]` Array of endpoint definitions



Returns `void`

##### `enableCors`
Enables wildcard CORS for this server.

Returns `void`

##### `getApiSchema`
Returns the Server's ajv instance.

Returns `any`

##### `getApp`
Gets the Server's internal Express app.

Returns `any`

##### `getPort`
Gets the listening HTTP port.

Returns `number`

##### `start`
Starts listening for HTTP requests.

Parameters

*  config `Server_Config` 

Returns `Promise`

##### `stop`
Stops the server.

Returns `Promise`

