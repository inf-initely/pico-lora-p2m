import { formatByte, u82int } from '../helper.js'
import { Message } from './packet.js'

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
    super(`Message is corrupted, fail at CRC check!`, data)
    this.expected = expected
    this.got = u82int(data.subarray(-4))
  }
}
