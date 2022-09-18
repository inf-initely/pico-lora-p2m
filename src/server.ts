import { setupModule, setupAuxIndicator } from './common/init.js'
import { Rep } from './lib/connection/reply.js'
import { Mode } from './lib/modules/lora/constant.js'
import { Print } from './lib/print.js'
import { lora, onboardLED, lora_uart, lcd_i2c, lcd } from './module.js'
import Demo from './server/demo.js'
import { HW } from './pinout.js'
import { Button } from 'button'
import { Display } from './lib/display.js'
import { wait } from './lib/async.js'

const print = Print.prefix('[Main]')
async function main() {
  await setupModule()
  setupAuxIndicator()

  const config = lora.getConfig()!
  await lora.setMode(Mode.NORMAL)
  // const addr = new Address(config)
  const gc = lcd.createGraphicContext()

  const randomizePin = new Button(HW[29], { mode: INPUT_PULLDOWN })
  const rep = new Rep(lora)
  const display = new Display(gc)
  const demo = new Demo(rep, display)
  randomizePin.on('click', () => {
    print.log('Randomizer button clicked!')
    demo.randomize()
  })

  Object.assign(global, {
    lora,
    lora_uart,
    rep,
    gc,
    display,
    // demo,
    b: (...args: number[]) => Uint8Array.of(...args),
  })
  // await startServerClockSync(lora)
  await wait(50)
  demo.randomize()
}

main()
