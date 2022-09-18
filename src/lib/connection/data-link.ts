import { EventEmitter } from 'events'
import crc from 'crc-32'
import { int2u8, u82int } from '../helper.js'
import { UART } from 'uart'
import { Logger } from '../debug.js'
import { CRCError, NetworkError } from './error.js'
import { assertRange } from '../validator.js'
import { DataLink } from './interface.js'

enum CONTROL {
  START = 0x17,
  END = 0x1e,
  ESCAPE = 0x1b,
}

const encodeDict = {
  [CONTROL.END]: 0x0e,
  [CONTROL.START]: 0x07,
  [CONTROL.ESCAPE]: 0x0b,
}
const decodeDict = {
  0x0e: [CONTROL.END],
  0x07: [CONTROL.START],
  0x0b: [CONTROL.ESCAPE],
}

function encode(data: number[] | Uint8Array) {
  const arr: number[] = []
  for (const int of data)
      // prettier-ignore
      // @ts-expect-error
      if (encodeDict[int]) arr.push(CONTROL.ESCAPE, encodeDict[int])
      else arr.push(int)

  return arr
}

const print = new Logger(false, ['[LinkControl]'])
export default class LinkControl extends EventEmitter {
  constructor(public dataLink: DataLink, startListener = true) {
    super()
    if (startListener) this.startListening()
  }

  private listener: any
  private cursor = 0
  private buffer = new Uint8Array(512)
  private got = false
  private escapingNext = false
  startListening() {
    this.listener = this.dataLink.on('data', (chunk) => {
      for (const index in chunk) {
        const byte = chunk[index]
        // console.log(byte)
        if (byte === CONTROL.START) {
          // console.log('Got start')
          this.got = true
          this.resetBuffer()
          this.buffer[this.cursor] = byte
          this.cursor++
          continue
        }
        if (this.got == false) {
          // console.log('Skipping since its not in frame...')
          continue
        }
        if (byte === CONTROL.ESCAPE) {
          // console.log('Got something to escape!')
          this.escapingNext = true
          continue
        }
        if (byte === CONTROL.END) {
          // console.log('Got end!')
          this.buffer[this.cursor] = byte
          const buf = this.buffer.subarray(0, this.cursor + 1).subarray(1, -1)
          const payload = buf.subarray(0, -4)

          const payloadCrc = u82int(buf.subarray(-4))
          const calcCrc = crc.buf(payload)
          print.log('Checking payload CRC:', payload, payloadCrc, calcCrc)

          if (payloadCrc !== calcCrc) {
            print.log('Dropping packet! Fail at CRC check...', buf)
            this.emit('dropped', new CRCError(buf, calcCrc))
          } else {
            print.log('Emitted message:', payload)
            this.emit('message', payload)
          }

          this.resetBuffer()
          continue
        }
        if (this.escapingNext) {
          // prettier-ignore
          // @ts-ignore
          if (decodeDict[byte] != null) this.buffer[this.cursor] = decodeDict[byte]
          else this.buffer[this.cursor] = byte
          this.cursor++
          this.escapingNext = false
          continue
        }
        this.buffer[this.cursor] = byte
        this.cursor++
        continue
      }
    })
  }

  stopListening() {
    this.dataLink.off('data', this.listener)
  }

  private resetBuffer() {
    this.buffer = new Uint8Array(512)
    this.cursor = 0
    this.escapingNext = false
  }

  send(data: Uint8Array) {
    const checksum = crc.buf(data)
    const encoded = encode([...data, ...int2u8(checksum)])
    assertRange(encoded.length, 510)
    const frame = new Uint8Array([CONTROL.START, ...encoded, CONTROL.END])
    print.log('Sending frame:', frame)
    this.dataLink.write(frame)
  }

  write(data: Uint8Array) {
    this.dataLink.write(data)
  }

  addListener(
    eventName: 'dropped',
    listener: (data: NetworkError) => void
  ): void
  addListener(eventName: 'message', listener: (data: Uint8Array) => void): void
  addListener(eventName: 'error', listener: (e: Error) => void): void
  addListener(eventName: string, listener: (...args: any[]) => void): void {
    super.addListener(eventName, listener)
  }

  declare on: this['addListener']
  declare off: this['addListener']
  declare once: this['addListener']
  declare removeListener: this['addListener']
}
