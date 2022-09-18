import { EventEmitter } from 'events'
import { Connection } from './interface.js'
import { Arrayable, BroadcastPacket } from './packet.js'

export class Broadcast extends EventEmitter {
  constructor(protected connection: Connection) {
    super()
  }

  send(data: Uint8Array) {
    const broadcastMsg = Object.assign(new BroadcastPacket(), {
      data: Arrayable(data),
    })

    this.connection.send(broadcastMsg.toTypedArray())
    this.emit('send', broadcastMsg)
  }
}

export class Drain extends EventEmitter {
  constructor(protected connection: Connection) {
    super()

    connection.on('message', (msg) => {
      const broadcastMsg = Object.assign(new BroadcastPacket(), {
        data: Arrayable(msg),
      })
      this.emit('message', broadcastMsg)
    })
  }
}
