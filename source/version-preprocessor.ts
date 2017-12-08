import {Version} from "./version"
import {Bad_Request} from "./errors"
import {Request} from "./types"

export function getRequestVersionString(req: any, data: any): string | undefined {
  return req.params.version
    || data.version
    || undefined
}

export function prepareRequestVersionText(req: any, data: any): string {
  const text = getRequestVersionString(req, data)
  if (!text)
    throw new Bad_Request('Invalid version format ' + text)

  if (data.version)
    delete data.version

  return text
}

export function getVersion(req: any, data: any): Version | undefined {
  const text = prepareRequestVersionText(req, data)
  return Version.createFromString(text)
}

export function getSimpleVersion(req: any, data: any): Version | undefined {
  const text = prepareRequestVersionText(req, data)
  return Version.createFromSimpleString(text)
}

export function checkVersion(request: Request, versions: Version[]) {
  const version = request.version
  if (!version)
    throw new Bad_Request("Missing version property.")

  if (!versions.some(v => v.equals(version)))
    throw new Bad_Request("Unsupported version number")
}

export class VersionPreprocessor {
  private versions: Version []

  constructor(versions: Version []) {
    if (!versions.length)
      throw new Error('VersionPreprocessor.versions array cannot be empty.')

    this.versions = versions
  }

  common(request: Request): Promise<Request> {
    request.version = getVersion(request.original, request.data)
    checkVersion(request, this.versions)
    return Promise.resolve(request)
  }

  simpleVersion(request: Request): Promise<Request> {
    request.version = getSimpleVersion(request.original, request.data)
    checkVersion(request, this.versions)
    return Promise.resolve(request)
  }
}