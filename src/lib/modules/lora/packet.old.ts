// import crc32 from 'crc/crc32'
// import { number, instanceof as instanceOf, union } from 'zod'
// import { tuple } from 'zod'
// import { intersection } from 'zod'
// import { array } from 'zod'
// import { literal } from 'zod'
// import { object } from 'zod'
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

// export module BytePreset {
//   export const EMPTY = bytes()
//   export const SOH = bytes(BYTE.SOH)
//   export const STX = bytes(BYTE.STX)
//   export const EOT = bytes(BYTE.EOT)
//   export const ETB = bytes(BYTE.ETB)
// }

// export class Address implements Assertable {
//   public hi: number
//   public lo: number
//   public channel: number

//   static [Schema] = object({
//     hi: number().min(0x00).max(0xff),
//     lo: number().min(0x00).max(0xff),
//     channel: number().min(0x00).max(0x45),
//   })

//   assert(): void {
//     Address[Schema].parse(this)
//   }

//   constructor(config: Config)
//   constructor(hi: number, lo: number, channel: number)
//   constructor(hiOrConfig: Config | number, lo?: number, channel?: number) {
//     const config =
//       typeof hiOrConfig == 'object'
//         ? hiOrConfig
//         : { highAddress: hiOrConfig, lowAddress: lo, channel }

//     this.hi = config.highAddress
//     this.lo = config.lowAddress
//     this.channel = config.channel
//     Address[Schema].parse(this)
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

//   getArray() {
//     return [this.hi, this.lo, this.channel] as const
//   }

//   get id() {
//     return formatByte(new Uint8Array([this.hi, this.lo, this.channel]))
//   }

//   toString() {
//     return this.id
//   }
// }

// const possibleHead = or(BYTE.SOH, BYTE.STX, BYTE.ENQ)
// const possibleTail = or(BYTE.EOT, BYTE.ETB)

// const basePacketSchema = {
//   source: instanceOf(Address),
//   destination: instanceOf(Address),
//   head: tuple([possibleHead]),
//   tail: tuple([possibleTail]),
//   crc: array(number()).length(4),
//   body: array(number()),
// }

// const PacketSchema = object(basePacketSchema)
// export class Packet implements Assertable {
//   source: Address
//   destination: Address
//   head: Uint8Array = BytePreset.EMPTY
//   tail: Uint8Array = BytePreset.EMPTY
//   crc: Uint8Array = BytePreset.EMPTY
//   body: Uint8Array = BytePreset.EMPTY

//   constructor(body?: Uint8Array) {
//     this.body = body ?? BytePreset.EMPTY
//   }

//   static from(raw: Uint8Array): Packet {
//     // 3x2B address, 1B head, 1B data, 1B tail, 4B crc
//     const minimumLength = 3 + 3 + 1 + 1 + 1 + 4
//     if (raw.byteLength < minimumLength)
//       throw new Error(
//         `Packet didn't pass the minimum length required! Probably transmission error.`
//       )

//     const len = raw.byteLength
//     const target = raw.subarray(0, 3)
//     const source = raw.subarray(3, 6)
//     const head = raw.subarray(6, 7)
//     const crc = raw.subarray(len - 4, len)
//     const tail = raw.subarray(len - 5, len - 4)
//     const data = raw.subarray(7, len - 5)

//     const body = raw.subarray(0, len - 4)
//     const crc1 = crc32(body)
//     const crc0 = u8ArraytoInt(crc)

//     if (crc1 !== crc0)
//       throw new Error(
//         // prettier-ignore
//         `Packet is invalid, failed at CRC check. Receiving [${crc0.toString(16)}], ` +
//         `expecting it to be [${crc1.toString(16)}]`
//       )

//     const packet = new Packet(data)
//     return Object.assign(packet, {
//       head,
//       tail,
//       // @ts-ignore
//       source: new Address(...source),
//       // @ts-ignore
//       destination: new Address(...destination),
//     })
//       .setCrc(crc)
//       .assert()
//   }

//   setSource(address: Address) {
//     this.source = address
//     return this
//   }

//   setDestination(address: Address) {
//     this.destination = address
//     return this
//   }

//   setCrc(crc: Uint8Array) {
//     this.crc = crc
//     return this
//   }

//   setHead(head: Uint8Array) {
//     this.head = head
//     return this
//   }

//   setTail(tail: Uint8Array) {
//     this.tail = tail
//     return this
//   }

//   setBody(body: Uint8Array) {
//     this.body = body
//     return this
//   }

//   useEOT() {
//     this.tail = BytePreset.EOT
//     return this
//   }

//   useETB() {
//     this.tail = BytePreset.ETB
//     return this
//   }

//   getArrayPacket() {
//     return {
//       head: [...this.head],
//       tail: [...this.tail],
//       body: [...this.body],
//       crc: [...this.crc],
//       source: this.source,
//       destination: this.destination,
//     }
//   }

//   createData() {
//     return bytes(
//       ...this.destination.getArray(),
//       ...this.source.getArray(),
//       ...this.head,
//       ...this.body,
//       ...this.tail
//     )
//   }

//   updateCrc() {
//     const body = this.createData()
//     const calc = crc32(body)
//     this.crc = intToU8Array(calc)
//     return this
//   }

//   createArray() {
//     const data = this.createData()
//     if (this.crc == null) this.updateCrc()

//     return bytes(...data, ...this.crc)
//   }

//   assert() {
//     PacketSchema.parse(this.getArrayPacket())
//     return this
//   }
// }

// const dataHead = or(BYTE.SOH, BYTE.STX)
// const DataPacketSchema = object({
//   ...basePacketSchema,
//   head: tuple([dataHead]),
// })
// export class DataPacket extends Packet implements Assertable {
//   override head = BytePreset.SOH
//   override tail = BytePreset.EOT

//   useSOH() {
//     this.head = BytePreset.SOH
//     return this
//   }

//   useSTX() {
//     this.head = BytePreset.STX
//     return this
//   }

//   assert() {
//     DataPacketSchema.parse(this.getArrayPacket())
//     return this
//   }

//   static override from(data: Uint8Array | Packet): DataPacket {
//     const packet = data instanceof Uint8Array ? Packet.from(data) : data

//     const newPacket = new DataPacket(packet.body)
//     return Object.assign(newPacket, packet).assert()
//   }
// }

// const EnquiryPacketSchema = object({
//   ...basePacketSchema,
//   head: intersection(tuple([literal(BYTE.ENQ)]), array(number()).min(3)),
// })
// export class EnquiryPacket extends Packet implements Assertable {
//   assert() {
//     EnquiryPacketSchema.parse(this.getArrayPacket())
//     return this
//   }

//   static override from(data: Uint8Array | Packet): EnquiryPacket {
//     const packet = data instanceof Uint8Array ? Packet.from(data) : data

//     const clone = { ...packet }
//     clone.body = packet.body.subarray(2, packet.body.byteLength)
//     clone.head = bytes(...packet.head, ...packet.body.subarray(0, 2))

//     // return new EnquiryPacket(rest)
//     //   .setHead(bytes(FlagByte.ENQ, ...type))
//     //   .setTail(packet.tail)
//     //   .setSource(packet.source)
//     //   .setDestination(packet.destination)
//     //   .setCrc(packet.crc)
//     //   .assert()

//     const newPacket = new EnquiryPacket()
//     return Object.assign(newPacket, clone).assert()
//   }
// }

// const ClockPacketSchema = object({
//   ...basePacketSchema,
//   head: tuple([literal(BYTE.ENQ), literal(0x01)]),
//   tail: tuple([literal(BYTE.EOT)]),
// })
// abstract class ClockPacket extends EnquiryPacket {
//   override tail = BytePreset.EOT

//   static BROADCAST_HEAD = bytes(BYTE.ENQ, 0x01, BYTE.SOH)
//   static ACK_HEAD = bytes(BYTE.ENQ, 0x01, BYTE.ACK)

//   assert(): this {
//     ClockPacketSchema.parse(this.getArrayPacket())
//     return this
//   }
// }

// const ClockBroadcastPacketSchema = object({
//   ...ClockPacketSchema.shape,
//   head: intersection(
//     array(number()).min(3),
//     tuple([literal(BYTE.ENQ), literal(0x01), literal(BYTE.SOH)])
//   ),
// })
// export class ClockBroadcastPacket extends ClockPacket {
//   override head = ClockPacket.BROADCAST_HEAD

//   constructor(interval: number) {
//     super()
//     this.setInterval(interval)
//     this.updateTime()
//   }

//   setInterval(interval: number) {
//     const int = intToU8Array(interval)
//     this.head = bytes(...ClockPacket.BROADCAST_HEAD, int.byteLength, ...int)
//     return this
//   }

//   getInterval() {
//     return this.head.subarray(3 + 1)
//   }

//   updateTime(time?: number) {
//     this.body = intToU8Array(time == null ? millis() : time)
//     return this
//   }

//   getTime() {
//     return u8ArraytoInt(this.body)
//   }

//   static override from(raw: Uint8Array | Packet): ClockBroadcastPacket {
//     const enq = super.from(raw)
//     const packet = new ClockBroadcastPacket(0)
//     Object.assign(packet, enq)

//     const body = packet.body
//     const interval = packet.body.subarray(0, packet.body[0]! + 1)

//     packet.setHead(bytes(...ClockPacket.BROADCAST_HEAD, ...interval))
//     packet.setBody(body.subarray(interval.byteLength))
//     return packet.assert()
//   }
// }

// export class ClockAckPacket extends ClockPacket {
//   @Composition([...ClockPacket.ACK_HEAD])
//   override head = ClockPacket.ACK_HEAD

//   @MaxByteLength(0)
//   override body = Packet.EMPTY
// }
