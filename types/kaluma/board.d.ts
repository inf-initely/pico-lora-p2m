import { ADC } from 'adc'
import { Button } from 'button'
import { GPIO } from 'gpio'
import { I2C } from 'i2c'
import { PWM } from 'pwm'
import { SPI } from 'spi'

interface Board {
  /**
   * - `<string>`
   *
   * The ID of the target board. ex) `pico`, ...
   *
   * ```javascript
   * console.log(board.name) // e.g.) 'pico' for Raspberry Pi Pico.
   * ```
   *
   * For more properties, please check the page for each board.
   */
  name: 'pico'

  /** The pin number of the on-board LED. */
  LED: 25

  /**
   * Returns an instance of [GPIO](/docs/api/gpio) class. All arguments are
   * passed to the constructor.
   *
   * ```javascript
   * var gpio = board.gpio(0, OUTPUT)
   * gpio.high()
   * ```
   */
  gpio(...args: ConstructorParameters<typeof GPIO>): GPIO

  /**
   * Returns an instance of [Button](/docs/api/button) class. All arguments are
   * passed to the constructor.
   *
   * ```javascript
   * var btn0 = board.button(0)
   * btn0.on('click', () => {
   *   console.log('button clicked')
   * })
   * ```
   */
  button(...args: ConstructorParameters<typeof Button>): Button

  /**
   * Returns an instance of [PWM](/docs/api/pwm) class. All arguments are passed
   * to the constructor.
   *
   * ```javascript
   * var pwm1 = board.pwm(1, 100, 0.4)
   * pwm1.start()
   * ```
   */
  pwm(...args: ConstructorParameters<typeof PWM>): PWM

  /**
   * Returns an instance of [ADC](/docs/api/adc) class. All arguments are passed
   * to the constructor.
   *
   * ```javascript
   * var adc3 = board.adc(26)
   * adc.read() // Read analog value from pin 26.
   * ```
   */
  adc(...args: ConstructorParameters<typeof ADC>): ADC

  /**
   * Returns an instance of [I2C](/docs/api/i2c) class. All arguments are passed
   * to the constructor.
   *
   * ```javascript
   * var i2c0 = board.i2c(0)
   * i2c0.write(new Uint8Array([0x6b, 0x00]), 0x68)
   * i2c0.close()
   * ```
   */
  i2c(...args: ConstructorParameters<typeof I2C>): I2C

  /**
   * Returns an instance of [SPI](/docs/api/spi) class. All arguments are passed
   * to the constructor.
   *
   * ```javascript
   * var spi0 = board.spi(0)
   * spi0.send(new Uint8Array([0x6b, 0x00]))
   * spi0.close()
   * ```
   */
  spi(...args: ConstructorParameters<typeof SPI>): SPI

  /**
   * Returns an instance of [UART](/docs/api/uart) class. All arguments are
   * passed to the constructor.
   *
   * ```javascript
   * var serial0 = board.uart(0)
   * serial0.write('Hello, world\n')
   * serial0.close()
   * ```
   */
}

declare global {
  /**
   * The `board` object provide the board specific properties which you are
   * currently using.
   */
  const board: Board
}
