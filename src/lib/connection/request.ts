import { EventEmitter } from 'events'
import { int2u8, randomNumber, u82int } from '../helper.js'
import { AssertionError } from '../validator.js'
import { NetworkError } from './error.js'
import { Connection } from './interface.js'
import { Address, Arrayable, Data, Message, messageHandler } from './packet.js'
import CRC32 from 'crc-32'
import { BLOCK_SIZE } from './constant.js'
import { Print } from '../print.js'
import { wait } from '../async.js'

// export class Req extends EventEmitter {
//   constructor(protected connection: Connection) {
//     super()
//   }

//   send(data: Uint8Array, target: Address) {
//     const message = new Message()
//       .setData(Arrayable(data))
//       .setAddress(target)
//       .randomizeId()
//       .updateCRC()
//     const array = message.toTypedArray()

//     const handler = (msg: Uint8Array) => {
//       try {
//         const id = msg.subarray(3, 5)
//         // silently drop the message if it's not for us...
//         if (u8ArraytoInt(id) !== message.id) return
//         // only start to process message sincerely when the target is right
//         const parsed = Message.from(msg)
//         this.emit('message', parsed)
//         return this.connection.off('message', handler)
//       } catch (e) {
//         if (e instanceof NetworkError) {
//           console.log('Looks like the message got corrupted...')
//           console.log(e)
//           this.connection.send(array)
//           return
//         }
//         if (e instanceof ZodError) {
//           console.log('Wrong message format sent by the server...')
//           console.log(e)
//         } else {
//           console.log('Probably implementation error...')
//           console.log(e)
//         }
//         this.connection.off('message', handler)
//         throw e
//       }
//     }

//     this.connection.on('message', handler)
//     this.connection.send(array)
//   }
// }

const print = Print.prefix('[Req]')
console.log(print)
export class Req extends EventEmitter {
  private blocking = false
  private timeout: any
  private source: Address
  private pending: any = null

  constructor(protected connection: Connection) {
    super()
    // this.source = connection.getAddress()
  }

  // private interval(message: Uint8Array) {
  //   if (this.blocking == false) return
  //   this.timeout = setTimeout(() => {
  //     if (this.blocking == false) return
  //     this.connection.send(message)
  //     this.interval(message)
  //   }, randomNumber(50, 100))
  // }

  send(data: Uint8Array) {
    if (this.blocking)
      throw new Error(
        'Request is in block state until reply is received from the server'
      )
    this.blocking = true
    const { message, packet } = Message.create(data)
    print.info(`Requesting server with message #${message.id}:`, data)

    const handler = messageHandler((msg) => {
      // delete this listener
      this.connection.off('message', handlerWrapper)
      print.log('Reply listener destroyed.')

      this.blocking = false
      // this.stopInterval()

      print.log(`Reply received, message event emitted.`)
      return this.emit('message', msg)
    })
    const handlerWrapper = (raw: Uint8Array) => {
      print.log(`Intercepted message to check ID beforehand:`, raw)
      const id = u82int(raw.subarray(0, 2))
      print.log(`Got reply id:`, id)
      if (id !== message.id) {
        print.log(
          `Looks like this message is not for our request (unmatched ID), expected: #${message.id}, got: #${id}.`
        )
        print.log('Message dropped.')
        return
      }

      return handler(raw)
    }

    print.info(`Attaching reply listener for message #${message.id}`)
    this.connection.on('message', handlerWrapper)
    this.connection.send(packet)
    print.info(`Request #${message.id} sent.`)
    // this.startInterval(packet)
    // print.info(`Starting packet retry interval...`)
    this.pending = handlerWrapper
  }

  reset() {
    this.blocking = false
    this.connection.off('message', this.pending)
  }

  reliableSend(data: Uint8Array) {
    this.send(data)
    const handler = (data: Message) => {
      this.off('message', handler)
      clearTimeout(timeout)
    }
    this.on('message', handler)
    let timeout = setTimeout(() => {
      if (this.blocking || this.pending != null) {
        this.reset()
        this.reliableSend(data)
      }
    }, randomNumber(5000, 10000))
  }

  declare on: (event: 'message', callback: (message: Message) => void) => void
  declare once: this['on']
  declare addListener: this['on']
}
