import { BadRequest } from './errors'
import { LawnRequest, DeferredRequestTransform, RequestTransform } from './types'
import * as express from 'express'

const simplePattern = /^v(\d+)$/

const defaultPlatform = 'none'

export class Version {
  major: number = 1
  minor: number = 0
  platform: string = ''

  static fromString(text: string): Version | undefined {
    const match = text.match(simplePattern)
    if (!match)
      return undefined

    return new Version(parseInt(match[1]))
  }

  constructor(major: number, minor: number = 0, platform: string = defaultPlatform) {
    this.major = major
    this.minor = minor
    this.platform = platform
  }

  equals(version: Version): boolean {
    return this.major == version.major && this.minor == version.minor
  }

  toString(): string {
    return this.major + '.' + this.minor
      + (this.platform && this.platform != 'none' ? '.' + this.platform : '')
  }
}

export function getRequestVersionString(req: any, data: any): string | undefined {
  return req.params.version
    || data.version
    || undefined
}

export function prepareRequestVersionText(req: any, data: any): string {
  const text = getRequestVersionString(req, data)
  if (!text)
    throw new BadRequest('Invalid version format ' + text)

  if (data.version)
    delete data.version

  return text
}

export function getSimpleVersion(req: express.Request, data: any): Version | undefined {
  const text = prepareRequestVersionText(req, data)
  return Version.fromString(text)
}

export function checkVersion(request: LawnRequest, versions: Version[]) {
  const version = request.version
  if (!version)
    throw new BadRequest('Missing version property.')

  if (!versions.some(v => v.equals(version)))
    throw new BadRequest('Unsupported version number')
}

export function applyVersioning(versions: number[]): RequestTransform {
  return request => {
    request.version = getSimpleVersion(request.original, request.data)
    checkVersion(request, versions.map(v => new Version(v)))
    return request
  }
}