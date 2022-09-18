// import crc32 from 'crc/crc32'
// import {
//   object,
//   array,
//   literal,
//   tuple,
//   intersection,
//   number,
//   union,
//   ZodSchema,
//   instanceof as instance,
//   infer as Infer,
// } from 'zod'
// import { intToU8Array, u8ArraytoInt } from '../helper.js'
// import { Assertable, or, Schema } from '../validator.js'
// import { Config, BYTE } from './constant.js'

// export function formatByte(data: Uint8Array) {
//   return Array.from(data)
//     .map((v) => v.toString(16).padStart(2, '0'))
//     .join(' ')
// }

// export function bytes(...byte: number[]) {
//   return new Uint8Array(byte)
// }

// interface Serializable<T> {
//   serialize(): T
// }

// export class Address
//   implements Serializable<Uint8Array>, Assertable, Infer<typeof Address.Schema>
// {
//   static Schema = object({
//     hi: number().min(0x00).max(0xff),
//     lo: number().min(0x00).max(0xff),
//     channel: number().min(0x00).max(0x45),
//   })

//   public hi: number
//   public lo: number
//   public channel: number

//   assert() {
//     ;(this.constructor as typeof Address).Schema.parse(this)
//     return this
//   }

//   constructor(config: Config)
//   constructor(array: number[] | Uint8Array)
//   constructor(hi: number, lo: number, channel: number)
//   constructor(
//     hiOrConfig: Config | number | number[] | Uint8Array,
//     lo?: number,
//     channel?: number
//   ) {
//     const config =
//       Array.isArray(hiOrConfig) || hiOrConfig instanceof Uint8Array
//         ? [...hiOrConfig]
//         : typeof hiOrConfig == 'object'
//         ? [hiOrConfig.highAddress, hiOrConfig.lowAddress, hiOrConfig.channel]
//         : [hiOrConfig, lo!, channel!].filter((v) => v != null)

//     if (config.length < 3) throw new Error('Invalid address array')

//     this.hi = config[0]
//     this.lo = config[1]
//     this.channel = config[2]
//     this.assert()
//   }

//   equal(address: Address): boolean
//   equal(hi: number, lo: number, channel: number): boolean
//   equal(...args: any[]): boolean {
//     if (args.length === 1) {
//       const target = args[0]
//       if (!(target instanceof Address))
//         throw new TypeError('Input received is not a valid address!')

//       return this.id === target.id
//     }
//     const hi = args[0]
//     const lo = args[1]
//     const channel = args[2]

//     return this.hi === hi && this.lo === lo && this.channel === channel
//   }

//   serialize() {
//     return bytes(this.hi, this.lo, this.channel)
//   }

//   get id() {
//     return formatByte(new Uint8Array([this.hi, this.lo, this.channel]))
//   }

//   toString() {
//     return this.id
//   }
// }

// export class Head
//   implements
//     Serializable<Uint8Array>,
//     Assertable,
//     Partial<Infer<typeof Head._Schema_>>
// {
//   source: Address
//   destination: Address
//   type: number

//   static _Schema_ = object({
//     type: number().min(0x00).max(0xff),
//     source: instance(Address),
//     destination: instance(Address),
//   })
//   static Schema: ZodSchema = this._Schema_

//   serialize(): Uint8Array {
//     // assert that all properties exist
//     this.assert()
//     return bytes(
//       ...this.destination!.serialize(),
//       ...this.source!.serialize(),
//       this.type!
//     )
//   }
//   assert() {
//     // assert that all properties exist
//     ;(this.constructor as typeof Head).Schema.parse(this)
//     this.source!.assert()
//     this.destination!.assert()
//     return this
//   }
// }

// export class DataHead extends Head implements Infer<typeof DataHead.Schema> {
//   static Schema = object({
//     ...Head._Schema_.shape,
//     type: union([literal(BYTE.SOH), literal(BYTE.STX)]),
//   })
//   type: BYTE.SOH | BYTE.STX = BYTE.STX
//   useSTX() {
//     this.type = BYTE.STX
//   }
//   useSOH() {
//     this.type = BYTE.SOH
//   }
// }

// export class EnquiryHead
//   extends Head
//   implements Infer<typeof EnquiryHead.Schema>
// {
//   static Schema = object({ ...Head._Schema_.shape, type: literal(BYTE.ENQ) })
//   type: BYTE.ENQ = BYTE.ENQ
// }

// export class Tail
//   implements Serializable<Uint8Array>, Assertable, Infer<typeof Tail._Schema_>
// {
//   static _Schema_ = object({
//     // type: number().min(0x00).max(0xff),
//     type: union([literal(BYTE.ETB), literal(BYTE.EOT)]),
//     crc: number(),
//   })
//   static Schema: ZodSchema = this._Schema_
//   crc: number
//   // type: number;
//   type: BYTE.ETB | BYTE.EOT = BYTE.ETB
//   serialize(): Uint8Array {
//     if (this.crc == null) throw new Error('Crc is empty!')
//     return bytes(this.type, ...intToU8Array(this.crc))
//   }
//   assert() {
//     ;(this.constructor as typeof Tail).Schema.parse(this)
//     return this
//   }
// }

// export class EnquiryTail
//   extends Tail
//   implements Infer<typeof EnquiryTail.Schema>
// {
//   static Schema = object({
//     ...Tail._Schema_.shape,
//     type: literal(BYTE.EOT),
//   })
//   type: BYTE.EOT = BYTE.EOT
// }

// export class Body
//   extends Uint8Array
//   implements Serializable<Uint8Array>, Assertable
// {
//   serialize(): Uint8Array {
//     return this
//   }
//   assert() {
//     return this
//   }
// }

// export class Packet
//   implements
//     Serializable<Uint8Array>,
//     Assertable,
//     Infer<typeof Packet._Schema_>
// {
//   static _Schema_ = object({
//     head: instance(Head),
//     tail: instance(Tail),
//     body: object({}),
//   })
//   head: Head
//   tail: Tail
//   body: Serializable<Uint8Array> & Assertable
//   static Schema: ZodSchema = this._Schema_

//   assert() {
//     ;(this.constructor as typeof Packet).Schema.parse(this)
//     this.head.assert()
//     this.tail.assert()
//     this.body.assert()
//     return this
//   }

//   serialize(): Uint8Array {
//     this.tail.assert()
//     return bytes(
//       ...this.head.serialize(),
//       ...this.body.serialize(),
//       ...this.tail.serialize()
//     )
//   }

//   serializeWithoutCrc() {
//     return [...this.head.serialize(), ...this.body.serialize(), this.tail.type]
//   }

//   updateCrc() {
//     const crc = crc32(bytes(...this.serializeWithoutCrc()))
//     this.tail.crc = crc
//   }

//   assertCrc() {
//     const current = this.tail.crc
//     const expected = crc32(bytes(...this.serializeWithoutCrc()))
//     literal(expected).parse(current)
//     return this
//   }

//   static MINIMUM_LENGTH = 13
//   static from(input: Uint8Array): Packet {
//     // 3x2 address + 1 head + 1 tail + 4 crc + minimum 1 byte body
//     if (input.byteLength < this.MINIMUM_LENGTH) {
//       throw new Error(
//         `Malformed input, size did not meet the format's minimum length of ${this.MINIMUM_LENGTH}`
//       )
//     }

//     // [dest        ] [source      ] [h ] [body 0x07 ~ -0x04] [t  ] [crc                  ]
//     // 0x00 0x01 0x02 0x03 0x04 0x05 0x06 ...             ... -0x05 -0x04 -0x03 -0x02 -0x01

//     const destination = new Address(input.subarray(0, 3))
//     const source = new Address(input.subarray(3, 6))
//     const head = input.subarray(6, 7)
//     const body = input.subarray(7, -5)
//     const tail = input.subarray(-5, -4)
//     const crc = input.subarray(-4 /*, -1*/)

//     return Object.assign(new Packet(), {
//       tail: Object.assign(new Tail(), {
//         crc: u8ArraytoInt(crc),
//         type: tail[0],
//       }),
//       head: Object.assign(new Head(), { destination, source, type: head[0] }),
//       body: new Body(body),
//     }).assert()
//   }
// }

// const EnquiryBodySchema = object({ type: number().min(0x00).max(0xff) })
// class EnquiryBody
//   implements
//     Serializable<Uint8Array>,
//     Assertable,
//     Infer<typeof EnquiryBodySchema>
// {
//   [Schema]: ZodSchema = EnquiryBodySchema
//   constructor(public type?: number) {}

//   serialize(): Uint8Array {
//     return bytes(this.type)
//   }

//   assert() {
//     this[Schema].parse(this)
//     return this
//   }
// }

// const BroadcastDataSchema = object({
//   type: literal(0x01),
//   interval: number(),
//   time: number(),
// })
// class BroadcastData
//   extends EnquiryBody
//   implements
//     Serializable<Uint8Array>,
//     Assertable,
//     Infer<typeof BroadcastDataSchema>
// {
//   [Schema] = BroadcastDataSchema
//   type: 0x01 = 0x01

//   constructor(public interval?: number, public time?: number) {
//     super()
//   }

//   serialize(): Uint8Array {
//     const int = intToU8Array(this.interval)
//     return bytes(this.type, int.byteLength, ...int, ...intToU8Array(this.time))
//   }

//   updateTime(time?: number) {
//     this.time = millis()
//     return this
//   }

//   assert() {
//     this[Schema].parse(this)
//     return this
//   }
// }

// const ClockBroadcastPacketSchema = object({
//   head: instance(EnquiryHead),
//   tail: instance(Tail),
//   body: instance(BroadcastData),
// })
// export class ClockBroadcastPacket
//   extends Packet
//   implements Infer<typeof ClockBroadcastPacketSchema>
// {
//   [Schema] = ClockBroadcastPacketSchema
//   tail = new EnquiryTail()
//   head = new EnquiryHead()
//   body = new BroadcastData()

//   constructor(interval?: number, time?: number) {
//     super()
//     this.body.interval = interval
//     this.body.time = time
//   }

//   static from(input: Uint8Array | Packet): ClockBroadcastPacket {
//     const packet = input instanceof Packet ? input : Packet.from(input)

//     const body = packet.body.serialize()
//     const type = body.subarray(0, 1)[0]
//     const len = body.subarray(1, 2)[0]
//     const interval = u8ArraytoInt(body.subarray(2, len + 2))
//     const time = u8ArraytoInt(body.subarray(len + 2))

//     return Object.assign(new ClockBroadcastPacket(), {
//       head: Object.assign(new EnquiryHead(), { type: packet.head }),
//       tail: Object.assign(new EnquiryTail(), packet.tail),
//       body: Object.assign(new BroadcastData(), { type, interval, time }),
//     }).assert()
//   }
// }
