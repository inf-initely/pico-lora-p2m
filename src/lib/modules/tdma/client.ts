import { Connection } from 'src/lib/connection/interface.js'
import { messageHandler } from 'src/lib/connection/packet.js'
import { Print } from 'src/lib/print.js'

const print = Print.prefix('[TDMA Client]')
export function getClock(connection: Connection) {
  return new Promise((res, rej) => {
    connection.on(
      'message',
      messageHandler((msg) => {
        print.log('Got message:', msg)
      })
    )
  })
}
