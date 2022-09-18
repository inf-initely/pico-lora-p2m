import { BufferedGraphicsContext } from 'graphics'
import { I2C } from 'i2c'
import { LED } from 'led'
import { UART } from 'uart'
import { SSD1306 } from './lib/modules/lcd.js'
import { LoRaE32 } from './lib/modules/lora/index.js'
import { HW } from './pinout.js'

const LORA_UART_BUS = 0
// const LORA_UART_TX = 12
// const LORA_UART_RX = 13
// const LORA_AUX = 15
// const LORA_M0 = 20
// const LORA_M1 = 21
const LORA_UART_TX = HW[16]
const LORA_UART_RX = HW[17]
const LORA_AUX = HW[20]
const LORA_M0 = HW[26]
const LORA_M1 = HW[27]

const ONBOARD_LED = 25

const LCD_I2C_BUS = 0
// const LCD_I2C_SDA = 16
// const LCD_I2C_SCL = 17
const LCD_I2C_SDA = HW[21]
const LCD_I2C_SCL = HW[22]

export const lcd_i2c = new I2C(LCD_I2C_BUS, {
  sda: LCD_I2C_SDA,
  scl: LCD_I2C_SCL,
})

export const lora_uart = new UART(LORA_UART_BUS, {
  baudrate: 9600,
  // bits: 8,
  // parity: UART.PARITY_NONE,
  // stop: 1,
  // bufferSize: 2048,
  tx: LORA_UART_TX,
  rx: LORA_UART_RX,
})

export const lcd = new SSD1306(lcd_i2c)
export const lora = new LoRaE32(lora_uart, {
  aux: LORA_AUX,
  m0: LORA_M0,
  m1: LORA_M1,
})

export const onboardLED = new LED(ONBOARD_LED)
