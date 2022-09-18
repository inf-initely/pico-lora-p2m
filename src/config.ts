import { setupModule, setupAuxIndicator } from './common/init.js'
import { Address } from './lib/connection/packet.js'
import { Rep } from './lib/connection/reply.js'
import { Display } from './lib/display.js'
import { lora, onboardLED, lora_uart, lcd_i2c, lcd } from './module.js'

async function main() {
  await setupModule()
  setupAuxIndicator()

  // const config = lora.getConfig()!
  // const addr = new Address(config)
  const gc = lcd.createGraphicContext()
  const display = new Display(gc)
  display.header('CHECK_OK')

  // const rep = new Rep(lora, addr)
  // rep.on('message', (data: Uint8Array) => {
  //   console.log(data)
  // })

  // globalThis['lora'] = lora
  // globalThis['lora_uart'] = lora_uart
  // // fixed transmission
  // // lora_uart.write(new Uint8Array([0xC0, 0x00, 0x00, 0x1A, 0x06, 0xC4]))
  // // broadcast transmission
  // lora_uart.write(new Uint8Array([0xc0, 0x00, 0x00, 0x1a, 0x06, 0x44]))
  // await lora.setConfig({...config, h})
  // globalThis['rep'] = rep
  // globalThis['addr'] = addr
  // onboardLED.on()
}

main()
