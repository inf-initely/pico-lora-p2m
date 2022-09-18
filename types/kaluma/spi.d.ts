declare module 'spi' {
  namespace Mode {
    type Type<T extends number> = Opaque<T, 'SPIMode'>

    type MODE_0 = Type<0>
    type MODE_1 = Type<1>
    type MODE_2 = Type<2>
    type MODE_3 = Type<3>

    type All = MODE_0 | MODE_1 | MODE_2 | MODE_3
  }

  namespace BitOrder {
    type Type<T extends number> = Opaque<T, 'SPIBitOrder'>

    type MSB = Type<0>
    type LSB = Type<1>

    type All = MSB | LSB
  }

  class SPI {
    static MODE_0: Mode.MODE_0
    static MODE_1: Mode.MODE_1
    static MODE_2: Mode.MODE_2
    static MODE_3: Mode.MODE_3

    /** SPI bitorder, MSB is the first bit. */
    static MSB: BitOrder.MSB
    /** SPI bitorder, LSB is the first bit. */
    static LSB: BitOrder.LSB

    /**
     * - **`bus`** `<number>` SPI bus number.
     * - **`options`** `<object>` The object of SPI options. _Default values are
     *   depends on board (Check in a board page)._
     *
     *   - **`mode`** `<number>` `SPI.MODE_0` (CPOL=0/CPHA=0), `SPI.MODE_1`
     *       (CPOL=0/CPHA=1), `SPI.MODE_2` (CPOL=1/CPHA=0), or `SPI.MODE_3`
     *       (CPOL=1/CPHA=1). **Default:** `SPI.MODE_0`.
     *   - **`baudrate`** `<number>` Baud rate. **Default:** `3000000`, 3 Mbit/s
     *   - **`bitorder`** `<number>` `SPI.MSB (0)` or `SPI.LSB (1)` **Default:**
     *       `SPI.MSB (0)`.
     *   - **`sck`** `<number>` SPI SCK pin number.
     *   - **`mosi`** `<number>` SPI MOSI (TX) pin number.
     *   - **`miso`** `<number>` SPI MISO (RX) pin number.
     * - **Returns:** `<object>` An initialized SPI instance corresponds to the
     *   bus number. Once initialized, the same object will be returned.
     *
     * Instances of the `SPI` class can be created using the new keyword or by
     * calling spi.SPI() as a function. A `RangeError` will be thrown if
     * **`bus`** is not less than max bus number. Please see
     * [here](https://en.wikipedia.org/wiki/Serial_Peripheral_Interface#Clock_polarity_and_phase)
     * for more about SPI modes.
     *
     * ```javascript
     * // Create the SPI instance with master mode
     * const { GPIO } = require('gpio')
     * const { SPI } = require('spi')
     *
     * var spi0cs = new GPIO(9, OUTPUT) // Set chip select to pin 9.
     * var spiOptions = {
     *   // SPI options
     *   mode: SPI.MODE_0,
     *   baudrate: 800000,
     *   bitorder: SPI.MSB,
     * }
     * var spi0 = new SPI(0, spiOptions)
     * // ChipSelect LOW
     * spi0cs.write(LOW)
     * // transfer data...
     * spi0.close() // Close SPI bus 0
     * ```
     */
    constructor(
      bus: number,
      options?: {
        mode?: Mode.All
        baudrate?: number
        bitorder?: BitOrder.All
        sck?: number
        mosi?: number
        miso?: number
      }
    )

    /**
     * - **`data`** `<Uint8Array|string>` Data to write.
     * - **`timeout`** `<number>` Timeout in milliseconds. **Default:** `5000`.
     * - **Returns:** `<Uint8Array>` Received data or `null` if failed to transfer
     *   or timeout.
     *
     * Send and receive data simultaneously via SPI bus.
     *
     * ```javascript
     * const { GPIO } = require('gpio')
     * const { SPI } = require('spi')
     *
     * var spi0cs = new GPIO(9, OUTPUT) // Set chip select to pin 9.
     * var spiOptions = {
     *   // SPI options
     *   mode: SPI.MODE_0,
     *   baudrate: 800000,
     *   bitorder: SPI.MSB,
     * }
     * var spi0 = new SPI(0, spiOptions)
     * // ChipSelect LOW
     * spi0cs.write(LOW)
     * // Send two bytes and receive two bytes
     * var buf = spi0.transfer(new Uint8Array([0x88, 0x24])) // send and receive two byte data.
     * if (buf) {
     *   console.log(data.length) // == 2
     *   console.log(data[0]) // first byte
     *   console.log(data[1]) // second byte
     * }
     * ```
     */
    transfer(data: Data, timeout?: number): Uint8Array | null

    /**
     * - **`data`** `<Uint8Array|string>` Data to write.
     * - **`timeout`** `<number>` Timeout in milliseconds. **Default:** `5000`.
     * - **`count`** `<number>` Indicates how many times to send data. Default: `1`.
     * - **Returns:** `<number>` The number of bytes written, `-1` if it failed to
     *   write or timeout.
     *
     * Send data via SPI bus
     *
     * ```javascript
     * const { GPIO } = require('gpio')
     * const { SPI } = require('spi')
     *
     * var spi0cs = new GPIO(9, OUTPUT) // Set chip select to pin 9.
     * var spiOptions = {
     *   // SPI options
     *   mode: SPI.MODE_0,
     *   baudrate: 800000,
     *   bitorder: SPI.MSB,
     * }
     * var spi0 = new SPI(0, spiOptions)
     * // ChipSelect LOW
     * spi0cs.write(LOW)
     *
     * // Send 2 bytes with an array of numbers
     * var array = new Uint8Array([0x6b, 0x00])
     * spi0.send(array)
     * ```
     */
    send(data: Data, timeout?: number, count?: number): number | -1

    /**
     * - **`length`** `<number>` Data length to read.
     * - **`timeout`** `<number>` Timeout in milliseconds. **Default:** `5000`.
     * - **Returns:** `<Uint8Array>` Received data or `null` if failed to transfer
     *   or timeout.
     *
     * Receive data via SPI bus.
     *
     * ```javascript
     * const { GPIO } = require('gpio')
     * const { SPI } = require('spi')
     *
     * var spi0cs = new GPIO(9, OUTPUT) // Set chip select to pin 9.
     * var spiOptions = {
     *   // SPI options
     *   mode: SPI.MODE_0,
     *   baudrate: 800000,
     *   bitorder: SPI.MSB,
     * }
     * var spi0 = new SPI(0, spiOptions)
     * // ChipSelect LOW
     * spi0cs.write(LOW)
     *
     * // Receive 10 bytes
     * var buf = spi0.recv(10)
     * if (buf) {
     *   console.log(data.length) // == 10
     *   console.log(data[0]) // first byte
     *   console.log(data[1]) // second byte
     *   // ...
     * }
     *
     * spi0.close()
     * ```
     */
    recv(length: number, timeout?: number): Uint8Array | null

    /**
     * Closes the SPI bus.
     *
     * ```javascript
     * const { GPIO } = require('gpio')
     * const { SPI } = require('spi')
     *
     * var spi0cs = new GPIO(9, OUTPUT) // Set chip select to pin 9.
     * var spiOptions = {
     *   // SPI options
     *   mode: SPI.MODE_0,
     *   baudrate: 800000,
     *   bitorder: SPI.MSB,
     * }
     * var spi0 = new SPI(0, spiOptions)
     * // transfer data...
     * spi0.close() // Close SPI bus 0
     * ```
     */
    close(): void
  }
}
