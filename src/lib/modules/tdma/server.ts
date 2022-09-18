import { Connection } from 'src/lib/connection/interface.js'
import { MessagePacket } from 'src/lib/connection/packet.js'
import { Rep } from 'src/lib/connection/reply.js'
import { int2u8 } from 'src/lib/helper.js'
import { Print } from 'src/lib/print.js'

const print = Print.prefix('[TDMA Server]')
export async function startServerClockSync(connection: Connection) {
  print.info('Starting clock broadcast interval...')
  const interval = setInterval(() => {
    const now = int2u8(millis())
    const message = MessagePacket.create(now)

    connection.send(message.toTypedArray())
  }, 200)

  return new Promise((res, rej) => {
    print.info('Starting clock synchronization server...')
    const rep = new Rep(connection)
    rep.on('message', (msg) => {
      console.log('Received message:', msg)
    })
  }).finally(() => {
    clearInterval(interval)
  })
}
