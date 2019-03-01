# Vineyard Lawn

Vineyard Lawn is a wrapper for Express.js that provides a high level API for defining JSON web services.

Most tools used to create web services are designed primarily to serve HTML pages and any web service support is an additional feature. Lawn specializes exclusively in creating JSON web services.  Some of its features include:

* Consistent use of JSON.  Lawn will never return an HTML response.
* A single point in code that sends HTTP responses.
* All endpoint handlers either return a promise or throw an error.
* Simplified request objects that only contain the essentials for standard endpoint logic.
* Merging of POST data and query parameters.
* Built-in support for JSON Schema validation.
* Built-in support for versioning.

[Documentation](doc/index.md)
