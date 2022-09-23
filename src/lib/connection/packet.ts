import CRC32 from 'crc-32'
import { Logger } from '../debug.js'
import { int2u8, randomNumber, u82int } from '../helper.js'
import {
  Assertable,
  AssertionError,
  assertPrimitive,
  assertRange,
} from '../validator.js'
import { UnwantedPacketError } from './error.js'

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

export abstract class Packet implements Arrayable<Uint8Array>, Assertable {
  public prefix: number
  public data: Arrayable<Uint8Array>

  get length() {
    return this.data.length + 1
  }

  toTypedArray(): Uint8Array {
    return new Uint8Array([this.prefix, ...this.data.toTypedArray()])
  }

  assert() {
    assertRange(this.prefix, 0xff)
    return this
  }
}

export class MessagePacket extends Packet {
  prefix = 0x02
  public id: number

  get length() {
    return this.data.length + 3
  }

  toTypedArray(): Uint8Array {
    return new Uint8Array([
      this.prefix,
      ...int2u8(this.id),
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
  setData(data: Arrayable<Uint8Array>) {
    this.data = data
    return this
  }

  assert(): this {
    super.assert()
    assertRange(this.id, 0xffff)
    return this
  }

  static create(data: Uint8Array) {
    const packet = Object.assign(new MessagePacket(), {
      data: Arrayable(data),
      id: randomNumber(0xffff),
    })

    return packet
  }

  static from(packet: Uint8Array): MessagePacket {
    const prefix = packet[0]
    if (prefix !== 0x02) throw new UnwantedPacketError(packet, 0x02, prefix)

    const id = packet.subarray(1, 3)
    const data = packet.subarray(3)

    const result = new MessagePacket()
      .setId(u82int(id))
      .setData(Arrayable(data))
    return result
  }
}

export class BroadcastPacket extends Packet {
  prefix = 0x01

  static from(packet: Uint8Array): BroadcastPacket {
    const prefix = packet[0]
    if (prefix !== 0x01) throw new UnwantedPacketError(packet, 0x01, prefix)

    const data = packet.subarray(1)

    const result = Object.assign(new BroadcastPacket(), {
      data: Arrayable(data),
    })
    return result
  }
}

const printMsg = new Logger(false, ['[MessageHandler]'])
type Callback<T> = (input: T) => void
export function messageHandler(
  callback: Callback<MessagePacket>,
  errorCb?: Callback<unknown>
) {
  return (data: Uint8Array) => {
    printMsg.log('Received raw data from connection:', data)
    try {
      printMsg.log(`Parsing message...`)
      const parsed = MessagePacket.from(data)
      printMsg.log(`Message parsed! Passing message to callback.`)
      return void callback(parsed)
    } catch (e) {
      return void errorCb?.(e)
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
