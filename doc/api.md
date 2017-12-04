# Vineyard Lawn - Function API

Lawn provides an optional Server class that wraps Lawn's core routing functions and streamlines spinning up an API server.

## Example Usage

    createEndpoints(app, [
      {
        method: Method.get,
        path: "adventure",
        action: request => {
          const response = {}
          return Promise.resolve(response)
        }
      },
      {
        method: Method.post,
        path: "adventure",
        action: request => {
          if (!request.data.page)
            throw new BadRequest("Missing 'page' argument.")

          return Promise.resolve({})
        }
      },
    ])
   

## Endpoint Functions

### `createEndpoints`

Parameters

*  preprocessor `Request_Processor` 
*  endpoints `Endpoint_Info[]` 

Returns `void`

