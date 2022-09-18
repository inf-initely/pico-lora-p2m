import { lcd, lora, onboardLED } from 'src/module.js'

Object.assign(global, {
  ALLOW_PRINT_LOG: true,
  ALLOW_PRINT_WARN: true,
  ALLOW_PRINT_INFO: true,
  ALLOW_PRINT_ERROR: true,
})

export async function setupModule() {
  await lora.setup()
  await lcd.setup()
}

export function setupAuxIndicator() {
  // lora is busy
  lora.aux.addListener('low-level', () => {
    onboardLED.on()
  })
  // lora is idle
  lora.aux.addListener('high-level', () => {
    onboardLED.off()
  })
}
