# Vineyard Lawn Server

Lawn provides an optional Server class that wraps Lawn's core routing functions and streamlines spinning up an API server.

## `Server` class
### Constructor

Parameters

* *(optional)* defaultPreprocessor `Request_Processor` 
* *(optional)* requestListener `RequestListener` 

Returns `Server`

### Functions

#### `addApiSchemaHelper`
Adds an API validation schema to the Server's ajv instance

Parameters

*  schema `any` 

Returns `void`

#### `compileApiSchema`
Compiles an API vaidation schema using ajv.

Parameters

*  schema `any` 

Returns `any`

#### `createEndpoints`
Main function to create one or more endpoints.

Parameters

*  preprocessor `Request_Processor` 
*  endpoints `Endpoint_Info[]` 

Returns `void`

#### `enableCors`
Enables wildcard CORS for this server

Returns `void`

#### `getApiSchema`
Returns the Server's ajv instance.

Returns `any`

#### `getApp`
Returns the internal Express app

Returns `any`

#### `getPort`
Gets the listening HTTP port

Returns `number`

#### `start`
Starts listening for HTTP requests

Parameters

*  config `Server_Config` 

Returns `Promise`

#### `stop`
Stops the server

Returns `Promise`

