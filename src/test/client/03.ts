import { nanoid } from 'nanoid/non-secure'
import { Drain } from 'src/lib/connection/broadcast.js'
import { Req } from 'src/lib/connection/request.js'
import { Logger } from 'src/lib/debug.js'
import { formatByte } from 'src/lib/helper.js'
import * as Common from '../common.js'
import { prepare } from '../prepare.js'

const encoder = new TextEncoder()
const print = new Logger(true, ['[Drain]'])
async function main() {
  const { display, lora, clock } = await prepare()
  const drain = new Drain(lora)
  const getMsPrefix = Common.getMsPrefix.bind(clock)

  drain.on('message', (msg) => {
    print.log(getMsPrefix(), 'Broadcast Message Received:', msg)
    print.log(getMsPrefix(), 'Data:', formatByte(msg.data.toTypedArray()))
  })
}

main()
