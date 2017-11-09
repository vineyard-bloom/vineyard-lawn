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

  checkVersion(request: Request) {
    const version = request.version
    if (!version)
      throw new Bad_Request("Missing version property.")

    if (!this.versions.some(v => v.equals(version)))
      throw new Bad_Request("Unsupported version number")
  }

  common(request: Request): Promise<Request> {
    this.checkVersion(request)
    return Promise.resolve(request)
  }
}