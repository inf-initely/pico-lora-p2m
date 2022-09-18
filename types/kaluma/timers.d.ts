/**
 * - **`msec`** `<number>` The delay value in milliseconds.
 *
 * Waits for **`msec`** milliseconds.> This function would block all the process
 * for **`msec`** milliseconds, so> Please use it carefully. It will block the
 * entire console. `setTimeout`,> `setInterval` is strongly recommended instead
 * of this function.
 *
 * ```javascript
 * delay(3000) // delay 3 seconds.
 * ```
 */
declare function delay(msec: number): void

/**
 * - **Returns:** `<number>` The current timestamp in milliseconds.
 *
 * Returns the number of milliseconds elapsed since January 1, 1970 00:00:00 UTC.
 *
 * ```javascript
 * // Show the processing time of the function.
 * var startTime = millis() // store start time.
 * for (var i = 1; i <= 10; i++) console.log('Processing...', i * 10, '%')
 * var endTime = millis() //store end time.
 * console.log('Processing time is ', endTime - startTime, 'ms.')
 * ```
 */
declare function millis(): number

/**
 * - **`usec`** `<number>` The delay value in microseconds.
 *
 * Waits for **`usec`** microseconds. It provides finer grained time delays than
 * `delay()`.> This function is not so time correct, so don't use it for time
 * critical job.
 */
declare function delayMicroseconds(usec: number): void

/**
 * - **Returns:** `<number>` The current timestamp in microseconds.
 *
 * Returns the number of microseconds elapsed since the system boot. Typically
 * it will overflow after approximately 70 minutes.> This function is not so
 * time correct, so don't use it for time critical job.
 */
declare function micros(): number

/**
 * - **`callback`** `<function>` The function which is called after **`timeout`**
 *   milliseconds
 * - **`timeout`** `<number>` The timeout value in milliseconds.
 * - **Returns**: `<number>` Timer id.
 *
 * Set the timeout event which call the **`callback`** function after
 * **`delay`** milliseconds.
 *
 * ```javascript
 * // Show the message after 1 sec.
 * var timerId = setTimeout(function () {
 *   print('done.')
 * }, 1000) // 1sec timeout
 * ```
 */
declare function setTimeout(callback: () => void, timeout): number

/**
 * - **`callback`** `<function>` The function which is called at every
 *   **`interval`** milliseconds.
 * - **`interval`** `<number>` The time interval value in milliseconds.
 * - **Returns**: `<number>` Timer id.
 *
 * Set the interval event which call the **`callback`** function
 * every**`interval`** milliseconds.
 *
 * ```javascript
 * // Print "tick" for every seconds
 * var timerId = setInterval(function () {
 *   print('tick')
 * }, 1000) // 1sec interval
 * // ...
 * clearInterval(timerId) // To stop printing "tick"
 * ```
 */
declare function setInterval(callback: () => void, interval: number): number

/**
 * - **`id`** `<number>` Timer id.
 *
 * Clear timeout event which is set using `setTimeout()`.
 *
 * ```javascript
 * // Show the message after 1 sec.
 * var timerId = setTimeout(function () {
 *   print('done.')
 * }, 1000) // 1sec timeout
 * // ...
 * clearTimeout(timerId) // clear it after the timeout event.
 * ```
 */
declare function clearTimeout(id: number): void

/**
 * - **`id`** `<number>` Timer id.
 *
 * Clear interval event which is set using `setInterval()`.
 *
 * ```javascript
 * // Print "tick" for every seconds and clear it.
 * var timerId = setInterval(function () {
 *   print('tick')
 * }, 1000) // 1sec interval
 * // ...
 * clearInterval(timerId) // clear it to stop printing "tick"
 * ```
 */
declare function clearInterval(id: number): void
