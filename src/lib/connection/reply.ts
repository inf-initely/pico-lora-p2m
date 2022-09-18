import { EventEmitter } from 'events'
import { Logger } from '../debug.js'
import { NetworkError } from './error.js'
import { Connection } from './interface.js'
import { Arrayable, messageHandler, MessagePacket } from './packet.js'

const print = new Logger(false, ['[Rep]'])
export class Rep extends EventEmitter {
  private connectionHandler: any
  queue: number[] = []

  constructor(protected connection: Connection) {
    super()
    print.log('Starting Reply server message listener.')
    print.log(`Attaching listener to connection's message event.`)

    const handler = messageHandler(
      (msg) => {
        this.queue.push(msg.id)
        print.log(`Message received, pushed to reply queue.`)
        print.log(`Emitted message event.`)
        return this.emit('message', msg)
      },
      (e) => {
        if (e instanceof NetworkError) return void this.emit('dropped', e)
        if (!(e instanceof Error)) print.log('Bizarre error found:', e)
        this.emit('error', e)
      }
    )
    this.connectionHandler = handler
    connection.on('message', handler)
    this.connection.on('error', (e) => {
      this.emit('error', e)
    })
  }

  send(data: Uint8Array) {
    const q = this.queue.pop()
    if (q == null) throw new Error('Not receiving any request, send blocked.')
    print.log('Replying to message:', q)
    print.log('We reply them with:', data)
    const message = new MessagePacket()
      .setData(Arrayable(data))
      // .setTarget(q!.source)
      // .setSource(this.source)
      .setId(q!)
    // .updateCRC()

    // const array = message.toTypedArray()
    // const calc = CRC32.buf(array)
    // const packet = new Uint8Array([...array, ...int2u8(calc)])

    print.log('Packet sent!', data)
    this.connection.send(message.toTypedArray())
    this.emit('send', message)
  }

  addListener(eventName: 'send', listener: (data: MessagePacket) => void): void
  addListener(eventName: 'dropped', listener: (err: NetworkError) => void): void
  addListener(eventName: 'error', listener: (err: Error) => void): void
  addListener(
    eventName: 'message',
    listener: (message: MessagePacket) => void
  ): void
  addListener(eventName: string, listener: (...args: any[]) => void): void {
    super.addListener(eventName, listener)
  }
  declare on: this['addListener']
  declare once: this['addListener']
  declare off: this['addListener']

  destroy() {
    this.connection.off('message', this.connectionHandler)
  }
}
