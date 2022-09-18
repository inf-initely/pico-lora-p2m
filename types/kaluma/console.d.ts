interface Console {
  /**
   * - **`...data`** `<any>`Data which is shown in the console.
   *
   * Print out the data. to the console. The all data are converted to String
   * object automatically so there's no need to change it to String object.
   *
   * ```javascript
   * // print out "100 string value true 1,2,3"
   * var number = 100
   * var result = true
   * var arr = [1, 2, 3]
   * console.log(number, 'string value', result, arr)
   * ```
   */
  log(...args: any[]): void

  /**
   * - **`...data`** `<any>`Data which is shown in the console.
   *
   * Print out the data with red color to the console. The all data and
   * arguments are converted to String object automatically so there's no need
   * to change it to String object.
   *
   * ```javascript
   * // print out "100 string value true 1,2,3"
   * var number = 100
   * var result = true
   * var arr = [1, 2, 3]
   * console.error(number, 'string value', result, arr)
   * ```
   */
  error(...args: any[]): void
}

/**
 * The `console` object provide the simple debugging console which provide a log
 * and error message.
 */
declare const console: Console
