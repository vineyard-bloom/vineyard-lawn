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

## Endpoint Types

### `enum` Method
* delete
* get
* post
* put

### `interface` EndpointInfo

#### Properties

* action `ResponseGenerator` Request handler function
* method `Method` HTTP Method
* middleware `any[]` Array of Express middleware to use just for this endpoint
* path `string` Relative endpoint path
* validator `ValidateFunction` AJV schema validator function

## Endpoint Functions

### createEndpoints

Parameters

*  preprocessor `RequestProcessor` Function to call before each endpoint handler

*  endpoints `EndpointInfo[]` Array of endpoint definitions



Returns `void`
