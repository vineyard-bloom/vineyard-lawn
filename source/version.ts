import {Bad_Request} from "./errors";

const advancedPattern = /^(\d+)(?:\.(\d+)(?:\.([a-z]+))?)?$/
const simplePattern = /^v(\d+)$/

const defaultPlatform = 'none'

export class Version {
  major: number
  minor: number
  platform: string

  static createFromString(text: string): Version | undefined {
    const match = text.match(advancedPattern)
    if (!match)
      return undefined

    return new Version(
      parseInt(match[1]),
      parseInt(match [2]),
      match[3] ? match[3] : defaultPlatform)
  }

  static createFromSimpleString(text: string): Version | undefined {
    const match = text.match(simplePattern)
    if (!match)
      return undefined

    return new Version(parseInt(match[1]))
  }

  private createFromStringOld(text: string) {
    const match = text.match(advancedPattern)
    if (!match)
      throw new Bad_Request('Invalid version format: ' + text)

    this.major = parseInt(match[1])
    this.minor = parseInt(match [2])
    this.platform = match[3]
      ? match[3]
      : defaultPlatform
  }

  constructor(majorOrString: number | string, minor: number = 0, platform: string = defaultPlatform) {
    if (typeof majorOrString === 'string') {
      console.error('Initializing a Version object with a string is deprecated.  Use one of the static Version.createFromString methods instead.')
      this.createFromStringOld(majorOrString)
    }
    else {
      this.major = majorOrString
      this.minor = minor
      this.platform = platform
    }
  }

  equals(version: Version): boolean {
    return this.major == version.major && this.minor == version.minor
  }

  toString(): string {
    return this.major + '.' + this.minor
      + (this.platform && this.platform != 'none' ? '.' + this.platform : '')
  }
}