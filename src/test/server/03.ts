import { nanoid } from 'nanoid/non-secure'
import { wait } from 'src/lib/async.js'
import { Broadcast } from 'src/lib/connection/broadcast.js'
import { Req } from 'src/lib/connection/request.js'
import { Logger } from 'src/lib/debug.js'
import { formatByte } from 'src/lib/helper.js'
import * as Common from '../common.js'
import { prepare } from '../prepare.js'

const encoder = new TextEncoder()
const print = new Logger(true, ['[Broadcast]'])
async function main() {
  const { display, lora, clock } = await prepare()
  const bc = new Broadcast(lora)
  const getMsPrefix = Common.getMsPrefix.bind(clock)

  bc.on('send', (msg) => {
    print.log(getMsPrefix(), 'Request sent:', msg)
    print.log(getMsPrefix(), 'Data sent:', formatByte(msg.data.toTypedArray()))
  })

  async function runTest(times: number, payloadSize = 48, waitTime = 500) {
    for (let i = 0; i < times; i++) {
      bc.send(encoder.encode(nanoid(payloadSize)))
      await wait(waitTime)
    }
  }

  Object.assign(globalThis, {
    runTest,
  })
}

main()
