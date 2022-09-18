import { setupModule, setupAuxIndicator } from '../common/init.js'
import { Rep } from '../lib/connection/reply.js'
import { Mode } from '../lib/modules/lora/constant.js'
import { lora, onboardLED, lora_uart, lcd_i2c, lcd } from '../module.js'
import { HW } from '../pinout.js'
import { Button } from 'button'
import { Display } from '../lib/display.js'
import { Logger } from '../lib/debug.js'

const print = new Logger(false, ['[Server]'])
export async function prepare() {
  await setupModule()
  setupAuxIndicator()

  await lora.setMode(Mode.NORMAL)
  const gc = lcd.createGraphicContext()
  const button = new Button(HW[29], { mode: INPUT_PULLDOWN })
  const display = new Display(gc)

  const clock = {
    offset: 0,
    get now() {
      return millis() + this.offset
    },
    adjust(realtimeMs: number) {
      this.offset = realtimeMs - millis()
    },
  }

  Object.assign(globalThis, { clock })
  return { lora, gc, display, button, lora_uart, onboardLED, lcd_i2c, clock }
}
