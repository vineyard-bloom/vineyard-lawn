import {Version} from "./version"
import {Bad_Request} from "./errors"
import {Request} from "./types"


export class VersionPreprocessor {
  versions: Version []

  constructor(versions: Version []) {
    if (!versions.length)
      throw new Error('VersionPreprocessor.versions array cannot be empty.')

    this.versions = versions
  }


  static getVersion(req: any, data: any): Version | undefined {
    if (typeof req.params.version === 'string') {
      return new Version(req.params.version)
    }
    else if (typeof data.version === 'string') {
      const version = new Version(data.version)
      delete data.version
      return version
    }
    return undefined
  }

  static getSimpleVersion(req: any, data: any): Version | undefined {
    if (typeof req.params.version === 'string') {
      return Version.createFromSimpleString(req.params.version)
    }
    else if (typeof data.version === 'string') {
      const version = Version.createFromSimpleString(data.version)
      delete data.version
      return version
    }
    return undefined
  }

  checkVersion(request: Request) {
    const version = request.version
    if (!version)
      throw new Bad_Request("Missing version property.")

    if (!this.versions.some(v => v.equals(version)))
      throw new Bad_Request("Unsupported version number")
  }

  common(request: Request): Promise<Request> {
    request.version = VersionPreprocessor.getVersion(request.original, request.data)
    this.checkVersion(request)
    return Promise.resolve(request)
  }

  simpleVersion(request: Request): Promise<Request> {
    request.version = VersionPreprocessor.getSimpleVersion(request.original, request.data)
    this.checkVersion(request)
    return Promise.resolve(request)
  }
}