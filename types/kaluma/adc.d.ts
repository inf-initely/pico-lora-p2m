/**
 * The `adc` module provides the ADC class which supports analog-digital
 * conversion. Use `require('adc')` to access this module.
 */
declare module 'adc' {
  /** An instances of `ADC` represents a ADC object. */
  class ADC {
    /**
     * - **`pin`** `<number>` The pin number which can support ADC function.
     * - **Returns:** `<object>` The return value is `ADC` object.
     *
     * ```javascript
     * const { ADC } = require('adc')
     * var a = new ADC(26)
     * ```
     */
    constructor(pin: number)

    /**
     * - **Returns:** `<number>` The return value is ADC object.
     *
     * This method returns the analog value read from the pin. A `RangeError`
     * will be thrown if **`adc.pin`** does not support ADC function.
     *
     * ```javascript
     * const { ADC } = require('adc')
     * var a = new ADC(26)
     * var value = a.read() // Read the ADC value at the pin 26.
     * ```
     */
    read(): number

    /**
     * - `<number>` The pin number which can support ADC function.
     *
     * The pin number of the ADC object.
     *
     * ```javascript
     * const { ADC } = require('adc')
     * var a = new ADC(26)
     * console.log(a.pin) // 26
     * ```
     */
    pin: number
  }
}
