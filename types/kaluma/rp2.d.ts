/**
 * > **THIS IS EXPERIMENTAL AND SUBJECT OF CHANGE**
 *
 * The `rp2` module includes features only for RP2 target. Use `require('rp2')`
 * to access this module.
 */
declare module 'rp2' {
  /**
   * - **`pins`** `<number[]>` An array of GPIO pin numbers for wakeup.
   * - **`events`** `<numbers[]>` An array of wakeup events for the `pins`
   *   parameter. The length of pins and events should be the same.
   *
   * Enter dormant mode for low power consumption.
   *
   * @prettier-ignore > Note that once it goes to dormant mode, the USB will be disconnected and
   * > the connection will not be recovered even when it wakes up. You need to
   * > reset the board.
   *
   * ```javascript
   * const rp2 = require('rp2')
   *
   * pinMode(25, OUTPUT) // On-board LED
   * pinMode(0, INPUT_PULLUP) // Button for dormant
   * pinMode(1, INPUT_PULLUP) // Button for wakeup
   *
   * // Blinking LED
   * setInterval(() => {
   *   digitalToggle(25)
   * }, 200)
   *
   * // Enter dormant when you press the button on GPIO 0.
   * setWatch(
   *   () => {
   *     // Wakeup when falling event detected on GPIO 1.
   *     rp2.dormant([1], [FALLING])
   *   },
   *   0,
   *   FALLING,
   *   10
   * )
   * ```
   */
  function dormant(pins: number[], events: SignalEvent.All[])

  // TODO: MISSING DEFINITION
}
