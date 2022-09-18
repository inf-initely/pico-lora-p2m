import { EventEmitter } from 'events'
import { AssertionError } from '../validator.js'
import { NetworkError } from './error.js'
import { Connection } from './interface.js'
import { Address, Arrayable, Data, Message, messageHandler } from './packet.js'
import CRC32 from 'crc-32'
import { int2u8 } from '../helper.js'
import { BLOCK_SIZE } from './constant.js'
import { Print } from '../print.js'

const print = Print.prefix('[Rep]')

export class Rep extends EventEmitter {
  private connectionHandler: any
  queue: Message<Arrayable<Uint8Array>>[] = []

  constructor(protected connection: Connection) {
    super()
    print.info('Starting Reply server message listener.')
    print.info(`Attaching listener to connection's message event.`)

    const handler = messageHandler((msg) => {
      this.queue.push(msg)
      print.log(`Message received, pushed to reply queue.`)
      print.log(`Emitted message event.`)
      return this.emit('message', msg)
    })
    this.connectionHandler = handler
    connection.on('message', handler)
  }

  send(data: Uint8Array) {
    const q = this.queue.pop()
    if (q == null) throw new Error('Not receiving any request, send blocked.')
    print.info('Replying to message:', q)
    print.info('We reply them with:', data)
    const message = new Message()
      .setData(Arrayable(data))
      // .setTarget(q!.source)
      // .setSource(this.source)
      .setId(q!.id)
    // .updateCRC()

    const array = message.toTypedArray()
    const calc = CRC32.buf(array)
    const packet = new Uint8Array([...array, ...int2u8(calc)])

    print.info('Packet sent!', data)
    this.connection.send(packet)
  }

  declare on: (event: 'message', callback: (message: Message) => void) => void
  declare once: this['on']
  declare addListener: this['on']

  destroy() {
    this.connection.off('message', this.connectionHandler)
  }
}
