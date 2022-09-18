/**
 * The `rtc` module supports RTC (Real Time Clock). Use `require('rtc')` to
 * access this module.
 */
declare module 'rpc' {
  /**
   * - **`time`** `<number>`
   *
   * Set RTC time to the number of milliseconds since Unix Epoch (UTC 1970/1/1-00:00).
   */
  function setTime(time: number): void

  /**
   * - **Returns** `<number>`
   *
   * Read RTC time and returns the time as the number of milliseconds since Unix
   * Epoch (UTC 1970/1/1-00:00).
   *
   * This is equivalent to `Date.now()`.
   */
  function getTime(): number
}
