// import { EventEmitter } from 'events'
// import { Connection } from './lib/connection/interface.js'
// import { Message, Address, Arrayable } from './lib/connection/packet.js'
// import { Req } from './lib/connection/request.js'

// const address = new Address(0x00, 0x01, 0x06)
// class MockConnection extends EventEmitter implements Connection {
//   constructor() {
//     super()
//     const buffer = 48
//     let buf = new Uint8Array(buffer)
//     let len: number | null = null
//     let cursor = 0
//     this.addListener('data', (data) => {
//       console.log('Got raw data:', data)
//       buf.set(data, cursor)
//       console.log('Current buffer:', buf)
//       cursor += data.byteLength
//       // if (cursor >= dataSize) {
//       //   this.emit('message', buf)
//       //   cursor = 0
//       //   buf.set(empty)
//       // }
//       if (cursor >= 3 && len == null) {
//         len = buf.subarray(2, 3)[0]
//         console.log('Got raw length:', len)
//       }
//       if (len != null && cursor >= len + 7) {
//         const data = buf.subarray(0, len + 7)
//         console.log('Got full raw message:', data)
//         this.emit('message', data)
//         len = null
//         buf = new Uint8Array([])
//       }
//     })
//   }

//   mockData(data: Uint8Array) {
//     this.emit('data', data)
//   }

//   send(data: Uint8Array): void {
//     console.log('data sent:', data)
//     this.emit('message', data)
//     // throw new Error('Method not implemented.')
//   }
//   getAddress(): Address {
//     return address
//     // throw new Error('Method not implemented.')
//   }
// }

// const target = new Address(0x01, 0x01, 0x06)
// const connection = new MockConnection()

// const data = new Uint8Array([1, 2, 3, 4])
// // const req = new Req(connection, target)
// // req.on('message', (data: Message) => {
// //   console.log('data received successfully:', data)
// // })
// // req.send(data)
// connection.on('message', (msg: Message) => {
//   console.log('Got message:', msg)
// })

// const mock = new Uint8Array([
//   0x45, 0x78, 0x04, 0x01, 0x02, 0x03, 0x04, 0x99, 0x99, 0x99, 0x99, 0x98, 0x98,
// ])

// connection.mockData(mock.subarray(0, 2))
// connection.mockData(mock.subarray(2, 3))
// connection.mockData(mock.subarray(3, 4))
// connection.mockData(mock.subarray(4, 6))
// connection.mockData(mock.subarray(6, 7))
// connection.mockData(mock.subarray(7, 8))
// connection.mockData(mock.subarray(8, 9))
// connection.mockData(mock.subarray(9, 10))
// connection.mockData(mock.subarray(10))
// // const message = new Message()
// //   .randomizeId()
// //   .setTarget(new Address(0x00, 0x01, 0x06))
// //   .setData(data)
// //   .updateCRC()
// // console.log(message, message.toTypedArray())

import { PacketStream } from './lib/connection/stream.js'

const b = (...args: number[]) => Uint8Array.of(...args)
const stream = new PacketStream()

stream.on('packet', (packet) => {
  console.log('Got packet:', packet)
})

// should result in 2,3,4,5,6,0,7,8,9,10
stream.write(b(0, 0, 0, 0, 0, 1, 2, 3))
stream.write(b(4, 5, 6, 0, 7, 8))
stream.write(b(9, 10, 4, 0, 0, 0))

// should result in 2,3,4,0,5,6,7,8,9
stream.write(b(0, 0, 0, 0, 0, 1, 2, 3, 4))
stream.write(b(0))
stream.write(b(5, 6, 7, 8, 9))
stream.write(b(4))
stream.write(b(0, 0))

// should be scrapped
stream.write(b(1, 2, 3, 4, 5, 6, 7, 8, 9))
stream.write(b(0, 0))
stream.write(b(10, 11, 4))
stream.write(b(0, 0))

// should result in 4,5,6,7,8,9,10,7,0,0,10,11
stream.write(b(0))
stream.write(b(0))
stream.write(b(1, 4, 5, 6, 7, 8, 9, 10, 7))
stream.write(b(0, 0))
stream.write(b(10, 11, 4))
stream.write(b(0, 0))
