import { Button } from 'button'
import Demo from './client/demo.js'
import { setupModule, setupAuxIndicator } from './common/init.js'
import { wait } from './lib/async.js'
import { Req } from './lib/connection/request.js'
import { Display } from './lib/display.js'
import { Mode } from './lib/modules/lora/constant.js'
import { getClock } from './lib/modules/tdma/client.js'
import { Print } from './lib/print.js'
import { lcd, lora, lora_uart, onboardLED } from './module.js'
import { HW } from './pinout.js'

const print = Print.prefix('[Main]')
async function main() {
  await setupModule()
  setupAuxIndicator()

  const config = lora.getConfig()!
  await lora.setMode(Mode.NORMAL)
  const gc = lcd.createGraphicContext()
  const display = new Display(gc)

  const fetchPin = new Button(HW[29], { mode: INPUT_PULLDOWN })
  const req = new Req(lora)
  req.on('message', (data) => {
    print.log('Got reply from Request:', data)
  })
  const demo = new Demo(req, display)
  fetchPin.on('click', () => {
    print.log('Fetch random number clicked!')
    demo.getRandom()
  })

  Object.assign(global, {
    lora,
    lora_uart,
    req,
    gc,
    demo,
    b: (...args: number[]) => Uint8Array.of(...args),
  })

  // const clock = getClock(lora)
  // globalThis['lora'] = lora
  // globalThis['req'] = req
  // globalThis['addr'] = addr
  await wait(50)
  display.header('Idle.', 'Press the button')
}

main()
