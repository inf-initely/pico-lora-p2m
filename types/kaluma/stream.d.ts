/**
 * > **THIS IS EXPERIMENTAL AND SUBJECT OF CHANGE**
 *
 * This `steam` module provides abstract interfaces for working with streaming
 * data. Use `require('stream')` to access this module.
 */
declare module 'stream' {
  import { EventEmitter } from 'events'

  /**
   * - Extends: [`EventEmitter`](/docs/api/events/#class-eventemitter)
   *
   * This is a class for stream.
   */
  class Stream extends EventEmitter {
    /**
     * - `{boolean}`
     *
     * Indicates whether the stream is readable or not.
     */
    reeadable: boolean

    /**
     * - `{boolean}`
     *
     * Indicates whether the stream is writable.
     */
    writable: boolean

    /**
     * - **`size`** `{number}`
     * - **Returns:** `{Uint8Array|null}`
     *
     * Read data as the specified `size` from the stream. If `size` not
     * specified, reads all data in the stream buffer.
     *
     * If the size of data in the stream buffer is less then `size`, returns `null`.
     */
    read(size?: number): Uint8Array | null

    /**
     * - **`chunk`** `{Uint8Array}`
     * - **Returns:** `{number}`
     *
     * Writes `chuck` to the stream and returns the number of bytes written.
     */
    write(chunk: Uint8Array): number

    /** Finishes to write. */
    end(): void

    /**
     * - Returns: `{this}`
     *
     * Closes the stream.
     */
    destroy(): this
  }
}
