import { formatByte, u82int } from '../helper.js'

export class NetworkError extends Error {
  public string: string

  constructor(message: string, public data: Uint8Array) {
    super(message)
    this.string = formatByte(data)
  }
}

export class CRCError extends NetworkError {
  public expected: number
  public got: number

  constructor(data: Uint8Array, expected: number) {
    const got = u82int(data.subarray(-4))
    super(
      `Message is corrupted, fail at CRC check! Expected: ${expected}, instead got: ${got}`,
      data
    )
    this.expected = expected
    this.got = got
  }
}

export class UnwantedIdError extends NetworkError {
  constructor(data: Uint8Array, expected: number, got: number) {
    super(
      `Message is not wanted. Waiting for: ${expected}, instead got: ${got}`,
      data
    )
  }
}

export class UnwantedPacketError extends NetworkError {
  constructor(data: Uint8Array, expected: number, got: number) {
    super(
      `Message is not wanted. Accept only: ${expected}, instead got: ${got}`,
      data
    )
  }
}
