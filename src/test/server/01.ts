import { Rep } from 'src/lib/connection/reply.js'
import { Logger } from 'src/lib/debug.js'
import { formatByte } from 'src/lib/helper.js'
import * as Common from '../common.js'
import { prepare } from '../prepare.js'

const print = new Logger(true, ['[Server]'])
async function main() {
  const { display, lora, clock } = await prepare()
  const rep = new Rep(lora)
  const getMsPrefix = Common.getMsPrefix.bind(clock)

  rep.on('message', (msg) => {
    const array = msg.data.toTypedArray()
    print.log(getMsPrefix(), 'Received request:', formatByte(array))
    rep.send(array)
    print.log(getMsPrefix(), 'Reflecting the request:', formatByte(array))
  })
  rep.on('error', (err) => {
    print.log(getMsPrefix(), 'Error occured:', err)
  })
  rep.on('dropped', (err) => {
    print.log(getMsPrefix(), 'A message got dropped:', err)
    print.log(getMsPrefix(), 'Message array:', err.string)
  })
  rep.on('send', (msg) => {
    print.log(getMsPrefix(), 'request sent:', msg)
  })
}

main()
