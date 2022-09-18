import CRC32 from 'crc-32'
import { int2u8, randomNumber, u82int } from '../helper.js'
import { Print } from '../print.js'
import {
  assert,
  Assertable,
  AssertionError,
  assertPrimitive,
  assertRange,
} from '../validator.js'
import { CRCError, NetworkError } from './error.js'

const EMPTY = new Uint8Array([])
export type AssertableArrayable<T extends ArrayBuffer> = Arrayable<T> &
  Assertable

export interface Arrayable<T extends ArrayBuffer> {
  toTypedArray(): T
  length: number
}

export function Arrayable<T extends ArrayBuffer>(data: T): Arrayable<T> {
  const wrapped = {
    data,
    toTypedArray() {
      return this.data
    },
    get length() {
      return this.data.byteLength
    },
  }

  return wrapped as Arrayable<T>
}

export function validateCRC(data: Uint8Array, againstCRC: number) {
  // const calcCRC = crc16(data)
  const calcCRC = CRC32.buf(data)
  console.log('validatingCRC', calcCRC, againstCRC)
  return calcCRC === againstCRC
}

interface ContainAddress {
  highAddress: number
  lowAddress: number
  channel: number
}

export class Address implements Arrayable<Uint8Array> {
  hi: number
  lo: number
  chan: number

  constructor(object: ContainAddress)
  constructor(hi: number, lo: number, chan: number)
  constructor(...args: [ContainAddress | number, number?, number?]) {
    const isSingle = args.length === 1
    const obj = (() => {
      if (isSingle) {
        assertPrimitive.object(args[0])
        return {
          hi: args[0]?.highAddress,
          lo: args[0]?.lowAddress,
          chan: args[0]?.channel,
        }
      }
      return { hi: args[0], lo: args[1], chan: args[2] }
    })()
    Object.assign(this, obj).assert()
  }

  toTypedArray(): Uint8Array {
    return new Uint8Array([this.hi, this.lo, this.chan])
  }

  assert() {
    assertRange(this.hi, 0xff)
    assertRange(this.lo, 0xff)
    assertRange(this.chan, 0x45)
    return this
  }

  get length() {
    return 3
  }
}

export class Message<Data extends Arrayable<Uint8Array> = Arrayable<Uint8Array>>
  implements Arrayable<Uint8Array>
{
  public data: Data
  public id: number = 0
  // public crc16: number
  // public crc32: number = 0

  // ID(2B) + LEN(1B)
  static FIXED_LENGTH = 3

  get length() {
    return this.data.length + Message.FIXED_LENGTH
  }
  get body() {
    this.assert()
    return new Uint8Array([
      ...int2u8(this.id),
      // ...int2u8(this.length),
      // will emit data length instead of total length
      ...int2u8(this.data.length),
      ...this.data.toTypedArray(),
    ])
  }

  randomizeId() {
    this.id = randomNumber(0xffff)
    return this
  }
  setId(id: number) {
    this.id = id
    return this
  }
  setData(data: Data) {
    this.data = data
    return this
  }

  static calculateCRC(input: Message<any>): Uint8Array
  static calculateCRC(input: Message<any>, raw: false): Uint8Array
  static calculateCRC(input: Message<any>, raw: true): number
  static calculateCRC(input: Message<any>, raw = false): number | Uint8Array {
    const array = input.toTypedArray()
    const calc = CRC32.buf(array)
    return raw ? calc : int2u8(calc)
  }

  toTypedArray(): Uint8Array {
    return this.body
  }
  assert() {
    assertRange(this.id, 0xffff)
    return this
  }

  static from(raw: Uint8Array): Message<Arrayable<Uint8Array>> {
    // minimum required for data length is 14, consists of:
    // - 2B Random ID         >   3B (FIXED_LENGTH)
    // - 1B Packet Length   -/
    // - Minimum of 1B Data       1B
    // - 4B CRC                   4B
    if (raw.byteLength < this.FIXED_LENGTH + 5)
      throw new NetworkError(
        'Data cannot meet required length, possibly corrupted',
        raw
      )

    const body = raw.subarray(0, -4)
    const id = body.subarray(0, 2)
    const len = body.subarray(2, 3)
    // data length should be handled by Data class
    const data = body.subarray(3)
    const crc = raw.subarray(-4)

    assert(
      len[0] === data.byteLength,
      `Explicit data length is not equal to the actual length (expected: ${len[0]}, got: ${data.byteLength})`
    )

    const incomingCrc = u82int(crc)
    const expectedCrc = CRC32.buf(body)
    if (incomingCrc !== expectedCrc) throw new CRCError(raw, incomingCrc)

    return Object.assign(new Message(), {
      id: u82int(id),
      // len: len[0],
      data: Arrayable(data),
      // drop crc
      // crc: incomingCrc,
    }).assert()
  }

  static create(raw: Uint8Array) {
    const message = new Message()
      .setData(Arrayable(raw))
      // .setTarget(this.destination)
      // .setSource(this.source)
      .randomizeId()
    // .updateCRC()

    const array = message.toTypedArray()
    const calc = CRC32.buf(array)
    const packet = new Uint8Array([...array, ...int2u8(calc)])

    return {
      packet,
      message,
    }
  }
}

export class AddressedMessage extends Message {
  public target: Address
  public source: Address

  // TARGET(3B) + SOURCE(3B) + ID(2B) + LEN(1B)
  static FIXED_LENGTH = 3 + 3 + 2 + 1

  get length() {
    return this.data.length + AddressedMessage.FIXED_LENGTH
  }

  get body() {
    this.assert()
    return new Uint8Array([
      ...this.target.toTypedArray(),
      ...this.source.toTypedArray(),
      ...int2u8(this.id),
      // ...int2u8(this.length),
      // will emit data length instead of total length
      ...int2u8(this.data.length),
      ...this.data.toTypedArray(),
    ])
  }
  setTarget(addr: Address) {
    this.target = addr
    return this
  }
  setSource(addr: Address) {
    this.source = addr
    return this
  }
  assert() {
    assertRange(this.id, 0xffff)
    // assertRange(this.crc32, 0xffffffff)
    // assertRange(this.length, 35)
    assertPrimitive.instance(this.target, Address)
    assertPrimitive.instance(this.source, Address)
    this.target.assert()
    this.source.assert()
    // this.data.assert()
    return this
  }

  static from(raw: Uint8Array): Message<Arrayable<Uint8Array>> {
    // minimum required for data length is 14, consists of:
    // - 3x2B Address       -\
    // - 2B Random ID         >   9B (FIXED_LENGTH)
    // - 1B Packet Length   -/
    // - Minimum of 1B Data       1B
    // - 4B CRC                   4B
    if (raw.byteLength < this.FIXED_LENGTH + 5)
      throw new NetworkError(
        'Data cannot meet required length, possibly corrupted',
        raw
      )

    const body = raw.subarray(0, -4)
    const target = body.subarray(0, 3)
    const source = body.subarray(3, 6)
    const id = body.subarray(6, 8)
    const len = body.subarray(8, 9)
    // data length should be handled by Data class
    const data = body.subarray(9)
    const crc = raw.subarray(-4)

    assert(
      len[0] === data.byteLength,
      `Explicit data length is not equal to the actual length (expected: ${len[0]}, got: ${data.byteLength})`
    )

    const incomingCrc = u82int(crc)
    const expectedCrc = CRC32.buf(body)
    if (incomingCrc !== expectedCrc) throw new CRCError(raw, incomingCrc)

    return Object.assign(new Message(), {
      target: new Address(...(target as any as [number, number, number])),
      source: new Address(...(source as any as [number, number, number])),
      id: u82int(id),
      // len: len[0],
      data: Arrayable(data),
      // drop crc
      // crc: incomingCrc,
    }).assert()
  }
}

const printMsg = Print.prefix('[MessageHandler]')
type Callback<T> = (input: T) => void
export function messageHandler(
  callback: Callback<Message>,
  errorsCb?: {
    onNetworkError?: Callback<NetworkError>
    onAssertionError?: Callback<AssertionError>
    onOtherError?: Callback<Error>
  }
) {
  const { onNetworkError, onAssertionError, onOtherError } = errorsCb ?? {}
  return (data: Uint8Array) => {
    printMsg.log('Received raw data from connection:', data)
    try {
      printMsg.log(`Parsing message...`)
      const parsed = Message.from(data)
      printMsg.log(`Message parsed! Passing message to callback.`)
      return void callback(parsed)
    } catch (e) {
      if (e instanceof NetworkError) {
        printMsg.error('Looks like the message got corrupted...')
        printMsg.error(e)
        return void onNetworkError?.(e)
      }
      if (e instanceof AssertionError) {
        printMsg.error('Wrong message format sent by the server...')
        printMsg.error(e)
        return void onAssertionError?.(e)
      }
      if (e instanceof Error) {
        printMsg.error('Probably implementation error...')
        printMsg.error(e)
        return void onOtherError?.(e)
      }
      printMsg.error('Bizarre (not?) error...')
      printMsg.error(e)
      throw e
    }
  }
}

export class Data implements Arrayable<Uint8Array> {
  data: Uint8Array

  constructor(data: Uint8Array, fixedN: number) {
    assertPrimitive.instance(data, Uint8Array)
    this.data = new Uint8Array(fixedN)
    this.data.set(data)
  }

  toTypedArray(): Uint8Array {
    return this.data
  }

  get length() {
    return this.data.byteLength
  }
}
