declare module 'uart' {
  import { EventEmitter } from 'events'

  namespace Parity {
    type Type<T extends number> = Opaque<T, 'UARTParity'>

    type NONE = Type<0>
    type ODD = Type<1>
    type EVEN = Type<2>

    type All = NONE | ODD | EVEN
  }

  namespace FlowControl {
    type Type<T extends number> = Opaque<T, 'UARTFlowControl'>

    type NONE = Type<0>
    type RTS = Type<1>
    type CTS = Type<2>
    type BOTH = Type<3>

    type All = NONE | RTS | CTS | BOTH
  }

  type AllowedBaudRate =
    | 0
    | 50
    | 75
    | 110
    | 134
    | 150
    | 200
    | 300
    | 600
    | 1200
    | 1800
    | 2400
    | 4800
    | 9600
    | 19200
    | 38400
    | 57600
    | 115200
    | 230400

  class UART extends EventEmitter {
    /** Do not use a parity bit. */
    static PARITY_NONE: Parity.NONE
    /** Use odd parity bit */
    static PARITY_ODD: Parity.ODD
    /** Use even parity bit */
    static PARITY_EVEN: Parity.EVEN

    /** Do not use flow control. */
    static FLOW_NONE: FlowControl.NONE
    /** Use RTS flow control. */
    static FLOW_RTS: FlowControl.RTS
    /** Use CTS flow control. */
    static FLOW_CTS: FlowControl.CTS
    /** Use both RTS and CTS flow control. */
    static FLOW_RTS_CTS: FlowControl.BOTH

    /**
     * - **`port`** `<number>` UART port number. This value should be less than
     *   max port number.
     * - **`options`** `<object>` The object of UART options. _Default values are
     *   depends on board (Check in a board page)._
     *
     *   - **`baudrate`** `<number>` Baud rate. One of the `[0, 50, 75, 110, 134,
     *       150, 200, 300, 600, 1200, 1800, 2400, 4800, 9600, 19200, 38400,
     *       57600, 115200, 230400]`.
     *   - **`bits`** `<number>` Number of bits per a character. One of the `[8,
     *       9]`. **Default:**`8`
     *   - **`parity`** `<number>`. The parity is one of the `UART.PARITY_NONE (0)`,
     *       `UART.PARITY_ODD (1)`, or `UART.PARITY_EVEN (2)`. **Default:**
     *       `UART.PARITY_NONE`.
     *   - **`stop`** `<number>` Number of stop bits. One of the `[1, 2]`. **Default:** `1`.
     *   - **`flow`** `<number>` Flow control. One of the `UART.FLOW_NONE (0)`,
     *       `UART.FLOW_RTS (1)`, `UART.FLOW_CTS (2)`, or `UART.FLOW_RTS_CTS
     *       (3)`. **Default:** `UART.FLOW_NONE`
     *   - **`bufferSize`** `<number>` The size of internal read buffer.
     *   - **`tx`** `<number>` UART TX pin number.
     *   - **`rx`** `<number>` UART RX pin number.
     *
     * ```javascript
     * // Create the UART instance and close it
     * const { UART } = require('uart')
     * const options = {
     *   baudrate: 9600,
     *   bits: 8,
     *   partity: UART.PARTIY_NONE,
     *   stop: 1,
     *   flow: UART.FLOW_NONE,
     *   bufferSize: 2048,
     * }
     * const serial0 = new UART(0, options)
     * // read or write data...
     * serial0.close()
     * ```
     */
    constructor(
      port: number,
      options?: {
        baudrate?: AllowedBaudRate
        bits?: 8 | 9
        parity?: Parity.All
        stop?: 1 | 2
        flow?: FlowControl.All
        bufferSize?: number
        tx?: number
        rx?: number
      }
    )

    /**
     * - **`data`** `<Uint8Array|string>` Data to write.
     * - **`options`** `<object>`
     *
     *   - **`count`** `<number>` Indicates how many times to write data. **Default:** `1`.
     *
     * Writes data to the UART port.
     *
     * ```javascript
     * const { UART } = require('uart')
     * const serial0 = new UART(0, { baudrate: 38400 })
     *
     * // Write a string
     * serial0.write('Hello, world\n')
     *
     * // Write Uint8Array
     * serial0.write(new Uint8Array([0x00, 0x7f, 0x80, 0xff]))
     *
     * serial0.close()
     * ```
     */
    write(
      data: Data,
      options?: {
        count?: number
      }
    ): void

    /** Close the UART port. */
    close(): void

    addListener(eventName: 'data', listener: (data: Uint8Array) => void): void
    on: (eventName: 'data', listener: (data: Uint8Array) => void) => void
  }
}
