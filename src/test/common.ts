import { nanoid } from 'nanoid/non-secure'
import { MessagePacket } from 'src/lib/connection/packet.js'
import { Req } from 'src/lib/connection/request.js'

const encoder = new TextEncoder()
export async function doRoundTrip(
  this: Req,
  payloadSize: number,
  waitTime?: () => number
) {
  return new Promise<MessagePacket>((res, rej) => {
    const handler = (msg: MessagePacket) => {
      this.off('message', handler)
      res(msg)
    }
    this.on('message', handler)
    this.reliableSend(encoder.encode(nanoid(payloadSize)), {
      generateWaitTime: waitTime,
    })
  })
}

export function getMsPrefix(this: { now: number }) {
  return `[${this.now}]`
}
