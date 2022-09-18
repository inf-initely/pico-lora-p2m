import { EventEmitter } from 'events'
import { randomNumber, u82int } from '../helper.js'
import { Connection } from './interface.js'
import { messageHandler, MessagePacket } from './packet.js'
import { Logger } from '../debug.js'
import { NetworkError, UnwantedIdError } from './error.js'

const print = new Logger(false, ['[Req]'])
export class Req extends EventEmitter {
  private blocking = false
  private pending: any = null

  constructor(protected connection: Connection) {
    super()
    this.connection.on('error', (e) => {
      this.emit('error', e)
    })
  }

  send(data: Uint8Array) {
    if (this.blocking)
      throw new Error(
        'Request is in block state until reply is received from the server'
      )
    this.blocking = true
    const message = MessagePacket.create(data)
    print.log(`Requesting server with message #${message.id}:`, data)

    const handler = messageHandler(
      (msg) => {
        // delete this listener
        this.connection.off('message', handler)
        print.log('Reply listener destroyed.')

        this.blocking = false
        // this.stopInterval()

        print.log(`Reply received, message event emitted.`)
        return this.emit('message', msg)
      },
      (e) => {
        if (e instanceof NetworkError) return void this.emit('dropped', e)
        if (!(e instanceof Error)) print.log('Bizarre error found:', e)
        this.emit('error', e)
      }
    )

    print.log(`Attaching reply listener for message #${message.id}`)
    this.connection.on('message', handler)
    this.connection.send(message.toTypedArray())
    print.log(`Request #${message.id} sent.`)
    this.emit('send', message)
    this.pending = handler
  }

  reset() {
    this.blocking = false
    this.connection.off('message', this.pending)
  }

  reliableSend(
    data: Uint8Array,
    options?: {
      generateWaitTime?: () => number
    }
  ) {
    const { generateWaitTime } = options ?? {}
    this.send(data)
    const handler = (data: MessagePacket) => {
      this.off('message', handler)
      clearTimeout(timeout)
    }
    this.on('message', handler)
    let timeout = setTimeout(() => {
      if (this.blocking || this.pending != null) {
        this.reset()
        this.reliableSend(data)
      }
    }, generateWaitTime?.() ?? randomNumber(5000, 10000))
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
}
