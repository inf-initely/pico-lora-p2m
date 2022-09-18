/**
 * - **`...data`** `<any>`Data which is shown in the console.
 *
 * Print out data to the console. The main difference from
 * [console.log()](/docs/api/console) is that it do not print a carriage return
 * and a new line character (`\r\n`) in the end.
 *
 * ```javascript
 * // print out "100 string value true 1,2,3"
 * var number = 100
 * var result = true
 * var arr = [1, 2, 3]
 * print(number, 'string value', result, arr)
 * ```
 */
declare function print(...data: any[]): void

/**
 * - **`seed`** `<number>` A seed number to initialize.
 *
 * Initializes the pseudo-random number generator. When you use `Math.random()`,
 * it generate always the same random sequence. If you want to generate
 * different random number sequence, you need to provide different seed number.
 *
 * ```javascript
 * // Seeding by millisecond time
 * seed(millis())
 *
 * // Seeding by analog input
 * seed(analogRead(26) * 10000) // GPIO26 = ADC0
 * ```
 */
declare function seed(seed: number): void

/**
 * - **`data`** `<Uint8Array|string>` Binary data to encode.
 * - **Returns**: `<string>` Base64 encoded string.
 *
 * Returns a base64 encoded string from binary data.
 */
declare function btoa(data: Data): string

/**
 * - **`encodedData`** `<string>` Base64 encoded string data.
 * - **Returns**: `<Uint8Array>` Decoded binary data.
 *
 * Returns a decoded binary data from a base64 encoded string.
 */
declare function atob(encodedData: string): Uint8Array

/**
 * - **`data`** `<string>` Data to encode.
 * - **Returns:** `<string>` Encoded data.
 *
 * Encodes URI (Uniform Resource Identifier) component using
 * [percent-encoding](https://en.wikipedia.org/wiki/Percent-encoding). This
 * function escapes all characters excepts `A-Z a-z 0-9 - _ . ! ~ * ' ( )`.
 */
declare function encodeURIComponent(data: string): string

/**
 * - **`data`** `<string>` Data to decode.
 * - **Returns:** `<string>` Decoded data.
 *
 * Decodes URI (Uniform Resource Identifier) component using
 * [percent-encoding](https://en.wikipedia.org/wiki/Percent-encoding).
 */
declare function decodeURIComponent(data: string): string

declare class TextDecoder {
  /**
   * - **`label`** `<string>` Encoding type. Default: `'utf-8'`. Currently
   *   supported encoding types are `'ascii'` and `'utf-8'`.
   */
  constructor(label?: 'utf-8' | 'ascii')
  /**
   * - **`input`** `<Uint8Array>`
   * - Returns: `<string>`
   *
   * Decodes the input buffer and returns the decoded string.
   */
  decode(input: Uint8Array): string
  encoding: 'utf-8' | 'ascii'
}

declare class TextEncoder {
  /**
   * - **`label`** `<string>` Encoding type. Default: `'utf-8'`. Currently
   *   supported encoding types are `'ascii'` and `'utf-8'`.
   */
  constructor(label?: 'utf-8' | 'ascii')
  /**
   * - **`input`** `<string>`
   * - Returns: `<Uint8Array>`
   *
   * Encodes the input string and returns the encoded buffer.
   *
   * ```javascript
   * var encoder = new TextEncoder()
   * var buf = encoder.encode('abc') // [97, 98, 99]
   * ```
   */
  encode(input: string): Uint8Array
  encoding: 'utf-8' | 'ascii'
}

declare class SystemError extends Error {
  /**
   * - `<number>`
   *
   * An error code defined in
   * [err.h](https://github.com/kameleon-project/kameleon/blob/master/include/err.h).
   */
  errno: number

  /**
   * - `<string>`
   *
   * A string representation of `errno`.
   */
  code: string
}
