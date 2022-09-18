/** - The `events` module supports events. Use `require('events')` to access this module. */
declare module 'events' {
  /**
   * An instance of `EventEmitter` class will emits events. If you need to
   * define a class emitting events, you can defined a class by extending from
   * `EventEmitter`.
   *
   * ```javascript
   * const { EventEmitter } = require('events')
   *
   * class MyEmitter extends EventEmitter {}
   *
   * var myEmitter = new MyEmitter()
   *
   * myEmitter.on('event', () => {
   *   console.log('event occurred!')
   * })
   *
   * myEmitter.emit('event')
   * ```
   */
  class EventEmitter {
    /**
     * - **`eventName`** `{string}` The name of event
     * - **`listener`** `{function}` The callback function
     *
     * Add the `listener` function to the end of the listener array for the
     * event named `eventName`.
     *
     * ```javascript
     * server.addListener('connect', function () {
     *   // equivalent to server.on
     *   console.log('server connected')
     * })
     * ```
     */
    addListener(eventName: string, listener: (...args: any[]) => void): void

    /**
     * - **`eventName`** `{string}` The name of event
     * - **`...args`** `{any}` Arguments to be passed to the listener functions.
     *
     * Synchronously calls each of the listeners registered for the event named
     * `eventName`, in the order they were registered, passing the supplied
     * arguments to each.
     *
     * ```javascript
     * server.on('data', function (data) {
     *   console.log(data) // "data received"
     * })
     *
     * var data = 'data recived'
     * server.emit('data', data)
     * ```
     */
    emit<T extends any[]>(eventName: string, ...args: T): void

    /**
     * - **`eventName`** `{string}` The name of event.
     * - **`listener`** `{function}` The callback function.
     *
     * Alias for `emitter.addListener(eventName, listener)`.
     *
     * ```javascript
     * server.on('connect', function () {
     *   console.log('server connected')
     * })
     * ```
     */
    on: typeof this.addListener

    /**
     * - **`eventName`** `{string}` The name of event.
     * - **`listener`** `{function}` The callback function.
     *
     * Add one-time `listener` for the event named `eventName`. When the event
     * is triggered, the `listener` function is called and then removed from the
     * listener array of the event.
     *
     * ```javascript
     * server.once('connect', function () {
     *   console.log('connected')
     * })
     *
     * server.emit('connect') // 'connected' printed
     * server.emit('connect') // nothing printed
     * ```
     */
    once: typeof this.addListener

    /**
     * - **`eventName`** `{string}` The name of event.
     * - **`listener`** `{function}` The callback function.
     *
     * Remove the `listener` function from the listener array of the event name
     * `eventName`.
     *
     * ```javascript
     * function connectListener () {
     *   console.log('connected');
     * }
     *
     * server.addListener('connect', connectListener); // eq to server.on
     * server.emit('connect'); // 'connected' printed
     *
     * server.removeListener('connect' connectListener); // eq to server.off
     * server.emit('connect'); // nothing printed
     * ```
     */
    removeListener: typeof this.addListener

    /**
     * - **`eventName`** `{string}`
     *
     * Remove all listeners of the event named `eventName`.
     */
    removeAllListeners(eventName: string): void

    /**
     * Listener)
     *
     * - **`eventName`** `{string}` The name of event.
     * - **`listener`** `{function}` The callback function
     *
     * Alias for `emitter.removeListener(eventName, listener)`.
     */
    off: typeof this.addListener

    /**
     * - **`eventName`** `{string}` The name of event.
     * - **Returns:** `{Array<Function>}`
     *
     * Return all listeners of the given event.
     */
    listeners(eventName: string): ((...args: any[]) => void)[]

    /**
     * - **`eventName`** `{string}` The name of event.
     * - **Returns:** `{number}`
     *
     * Return the number of listeners of the given event.
     */
    listenerCount(eventName: string): number
  }
}
