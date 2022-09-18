/**
 * The `pwm` module supports PWM(Pulse Width Modulation). Use `require('pwm')`
 * to access this module.
 */
declare module 'pwm' {
  /** An instances of `PWM` represents a PWM object. */
  class PWM {
    /**
     * - **`pin`** `<number>` The pin number which can support PWM function.
     * - **`frequency`** `<number>` The PWM frequency in Hz. **Default:** `490`Hz
     * - **`duty`** `<number>` The PWM duty cycle between `0.0` and `1.0`.
     *   **Default:** `1.0`
     *
     * ```javascript
     * // Generate 1000 Hz 50% duth PWM signal on the pin 1.
     * const { PWM } = require('pwm')
     * const pwm = new PWM(1, 1000, 0.5) // Create the PWM instance with pin 1
     * pwm.start() // Generate PWM signal
     * // ...
     * pwm.stop() // Stop PWM signal
     * pwm.close() // Close PWM port.
     * ```
     */
    constructor(pin: number, frequency?: number, duty?: number)

    /**
     * Start to generate PWM signal.
     *
     * ```javascript
     * // Generate 1000 Hz 30% duth PWM signal on the pin 1.
     * const { PWM } = require('pwm')
     * const pwm = new PWM(1, 1000, 0.3) // Create the PWM instance with pin 1
     * pwm.start() // Generate PWM signal
     * ```
     */
    start(): void

    /**
     * Stop to generate PWM signal.
     *
     * ```javascript
     * // Generate 1000 Hz 50% duth PWM signal on the pin 1.
     * const { PWM } = require('pwm')
     * const pwm = new PWM(1, 1000, 0.5) // Create the PWM instance with pin 1
     * pwm.start() // Generate PWM signal
     * delay(100) // Wait 100ms.
     * pwm.stop() // Stop PWM signal
     * ```
     */
    stop(): void

    /**
     * - **Returns:** `<number>` PWM frequency of the PWM instance.
     *
     * Get the PWM frequency.
     *
     * ```javascript
     * // Generate 1000 Hz 50% duth PWM signal on the pin 1 and print the frequency
     * const { PWM } = require('pwm')
     * const pwm = new PWM(1, 1000, 0.5) // Create the PWM instance with pin 1
     * console.log(pwm.getFrequency()) // Print current PWM frequency.
     * ```
     */
    getFrequency(): number

    /**
     * - **`frequency`** `<number>` PWM frequency of the PWM instance.
     *
     * Set the new PWM frequency.
     *
     * ```javascript
     * // Generate 1000 Hz 50% duth PWM signal on the pin 1 and print the frequency
     * const { PWM } = require('pwm')
     * const pwm = new PWM(1, 1000, 0.5) // Create the 1000 Hz PWM instance with pin 1
     * pwm.setFrequency(500) // Change the PWM frequency to 500 Hz.
     * ```
     */
    setFrequency(frequency: number): void

    /**
     * - **Returns:** `<number>` PWM duty of the PWM instance.
     *
     * Get the PWM duty.
     *
     * ```javascript
     * // Generate 1000 Hz 50% duth PWM signal on the pin 1 and print the duty
     * const { PWM } = require('pwm')
     * const pwm = new PWM(1, 1000, 0.5) // Create the PWM instance with pin 1
     * console.log(pwm.getDuty()) // Print current PWM duty.
     * ```
     */
    getDuty(): number

    /**
     * - **`duty`** `<number>` PWM duty of the PWM instance.
     *
     * Set the new PWM duty.
     *
     * ```javascript
     * // Generate 1000 Hz 50% duth PWM signal on the pin 1 and print the duty
     * const { PWM } = require('pwm')
     * const pwm = new PWM(1, 1000, 0.5) // Create the PWM instance with pin 1
     * pwm.setDuty(0.7) // Change the PWM duty to 70%.
     * ```
     */
    setDuty(): number

    /**
     * Close the PWM port.
     *
     * ```javascript
     * // Generate 1000 Hz 50% duth PWM signal on the pin 1.
     * const { PWM } = require('pwm')
     * const pwm = new PWM(1, 1000, 0.5) // Create the PWM instance with pin 3
     * pwm.start() // Generate PWM signal
     * // ...
     * pwm.stop() // Stop PWM signal
     * pwm.close() // Close PWM port.
     * ```
     */
    close(): void
  }
}
