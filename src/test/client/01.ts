import { Req } from 'src/lib/connection/request.js'
import { Logger } from 'src/lib/debug.js'
import { formatByte, randomNumber } from 'src/lib/helper.js'
import * as Common from '../common.js'
import { prepare } from '../prepare.js'

const print = new Logger(true, ['[Client]'])
async function main() {
  const { display, lora, clock, button } = await prepare()
  const req = new Req(lora)
  const doRoundTrip = Common.doRoundTrip.bind(req)
  const getMsPrefix = Common.getMsPrefix.bind(clock)

  req.on('message', (msg) => {
    print.log(
      getMsPrefix(),
      'Received reply:',
      formatByte(msg.data.toTypedArray())
    )
  })
  req.on('error', (err) => {
    print.log(getMsPrefix(), 'Error occured:', err)
  })
  req.on('dropped', (err) => {
    print.log(getMsPrefix(), 'A message got dropped:', err)
    print.log(getMsPrefix(), 'Dropped message data:', err.string)
  })
  req.on('send', (msg) => {
    print.log(getMsPrefix(), 'Request sent:', msg)
  })

  async function runTest(
    times: number,
    payloadSize = 48,
    waitTime = () => randomNumber(5000, 10000)
  ) {
    for (let i = 0; i < times; i++) await doRoundTrip(payloadSize, waitTime)
  }

  Object.assign(globalThis, {
    doRoundTrip,
    runTest,
  })

  button.on('click', () => {
    runTest(10, 48, () => randomNumber(5000, 10000))
  })
}

main()
