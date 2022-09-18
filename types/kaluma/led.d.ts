/**
 * The `led` module supports LED which connect to GPIO pins. Use
 * `require('led')` to access this module.
 */
declare module 'led' {
  /** An instances of `LED` represents a LED. */
  class LED {
    /**
     * - **`pin`** `<number>` Pin number where LED connected.
     *
     * ```javascript
     * // Create the LED instance
     * const { LED } = require('led')
     * const led = new LED(0) // LED connected to pin 0.
     * ```
     */
    constructor(pin: number)

    /**
     * Turns on the LED.
     *
     * ```javascript
     * // Turn on the LED.
     * const { LED } = require('led')
     * const led = new LED(0) // LED connected to pin 0.
     * led.on()
     * ```
     */
    on(): void

    /**
     * Turns off the LED.
     *
     * ```javascript
     * // Turn off the LED.
     * const { LED } = require('led')
     * const led = new LED(0) // LED connected to pin 0.
     * led.off()
     * ```
     */
    off(): void

    /**
     * This method toggles the LED.
     *
     * ```javascript
     * // Toggle the LED.
     * const { LED } = require('led')
     * const led = new LED(0) // LED connected to pin 0.
     * led.on()
     * delay(1000) // wait for 1sec
     * led.off()
     * delay(1000) // wait for 1sec
     * led.toggle() // on
     * delay(1000) // wait for 1sec
     * led.toggle() // off
     * ```
     */
    toggle(): void

    /**
     * - Returns: `<number>` State of the LED. 1 means LED ON and 0 means LED OFF state.
     *
     * Read the state of the LED.
     *
     * ```javascript
     * // Read the state of LED.
     * const { LED } = require('led')
     * const led = new LED(0) // LED connected to pin 0.
     * led.on()
     * console.log(led.read()) // Returns 1.
     * delay(1000)
     * led.off()
     * console.log(led.read()) // Returns 0.
     * ```
     */
    read(): PinState.All

    /**
     * - `<number>`
     *
     * Pin number of the LED.
     *
     * ```javascript
     * // Javascript example: Print out the LED pin number.
     * const { LED } = require('led')
     * const led = new LED(0) // LED connected to pin 0.
     * console.log(led.pin) // print out the LED pin number, 0;
     * ```
     */
    pin: number
  }
}
