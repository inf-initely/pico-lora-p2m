/** The `button` module supports button. Use `require('button')` to access this module. */
declare module 'button' {
  /**
   * An instances of `Button` represents a button object. This class is a
   * subclass of [`EventEmitter`](/docs/api/events).
   */
  class Button {
    /**
     * - **`pin`** `<number>` The pin number which can support button function.
     * - **`options`** `<object>`
     *
     *   - **`mode`** `<number>` The pin mode. Default: `INPUT_PULLUP`.
     *   - **`event`** `<number>` The the event of the **`pin`**. There are three
     *       events, `FALLING (0)`, `RISING (1)`, and `CHANGE (2)`. **Default:**
     *       `FALLING`.
     *   - **`debounce`** `<number>` debounce time in ms(milliseconds). **Default:** `50`ms
     *
     * Create an instances of the `Button` class. Note that this class uses
     * `setWatch()` function internally.
     *
     * ```javascript
     * // Create the Button instance and print the message when button is pressed.
     * const { Button } = require('button')
     * const pin = 0 // Pin number for button
     * const btn0 = new Button(pin)
     * btn0.on('click', function () {
     *   console.log('button 1 clicked')
     * })
     * ```
     */
    constructor(
      pin: number,
      options?: {
        mode?: PinMode.All
        event?: SignalEvent.All
        debounce?: number
      }
    )

    /**
     * - **Returns:** `<number>` The return value is `HIGH (1)` or `LOW (0)`
     *
     * ```javascript
     * // Create the Button instance and close it.
     * const { Button } = require('button')
     * const pin = 0 // Pin number for button
     * const btn0 = new Button(pin)
     * // ...
     * btn0.close()
     * ```
     */
    read(): PinState.All

    /**
     * This method closes the I/O watcher for the button.
     *
     * ```javascript
     * // Create the Button instance and close it.
     * const { Button } = require('button')
     * const pin = 0 // Pin number for button
     * const btn0 = new Button(pin)
     * btn0.on('click', function () {
     *   console.log('button 1 clicked')
     * })
     * // ...
     * btn0.close()
     * ```
     */
    close(): void

    /**
     * The `click` event is emitted when the button is pressed down.
     *
     * ```javascript
     * // Create the Button instance and toggle LED when the button is pressed.
     * const { Button } = require('button')
     * const pin = 0 // Pin number for button
     * const btn0 = new Button(pin)
     * const led = 25 // LED
     * pinMode(led, OUTPUT)
     * btn.on('click', function () {
     *   digitalToggle(led)
     * })
     * ```
     */
    on(eventName: 'click', callback: () => void): void
  }
}
