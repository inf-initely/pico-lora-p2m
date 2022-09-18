import { BufferedGraphicsContext } from 'graphics'
import { Rep } from 'src/lib/connection/reply.js'
import { nanoid } from 'nanoid/non-secure'
import { Print } from 'src/lib/print.js'
import { Display } from 'src/lib/display.js'

const print = Print.prefix('[Demo]')
console.log(print)

function equal(a: Uint8Array, b: Uint8Array) {
  if (a.byteLength !== b.byteLength) return false
  for (const index in a) if (a[index] !== b[index]) return false
  return true
}

function splitInto(input: string, by: number) {
  const _by = Math.floor(by)
  if (input.length <= by) return [input]
  const len = Math.ceil(input.length / _by)
  const strings = []
  for (let i = 0; i < len * _by; i += _by) {
    strings.push(input.substring(i, i + _by))
  }
  return strings
}

const encoder = new TextEncoder()
const decoder = new TextDecoder()
export default class Demo {
  private string: Uint8Array
  private charLimit: number

  static STRING_SIZE = 48
  static GET_PACKET_SIZE = Uint8Array.of(0x01, 0x01)
  static PACKET_FRAGMENT = 4

  constructor(private rep: Rep, private display: Display) {
    this.charLimit = display.screenSize.width / display.fontSize.width
    const fragmentSize = Demo.STRING_SIZE / Demo.PACKET_FRAGMENT

    rep.on('message', (message) => {
      const data = message.data.toTypedArray()
      try {
        // get fragment size
        if (equal(data, Demo.GET_PACKET_SIZE)) {
          return rep.send(Uint8Array.of(0x01, Demo.PACKET_FRAGMENT))
        }
        // get fragment data
        else if (data[0] === 0x02) {
          if (data.byteLength > 2)
            throw new Error(
              'Get fragment instruction must only consists of 2 bytes'
            )

          const num = data[1]
          if (num > Demo.PACKET_FRAGMENT)
            throw new Error('Targeted fragment is out of index range')

          const start = fragmentSize * (num - 1)
          const end = fragmentSize * num
          return rep.send(this.string.subarray(start, end))
        }
      } catch (e) {
        print.error('Error on handling request:', e)
        return rep.send(Uint8Array.of(0x15, 0x15, 0x15, 0x15, 0x15))
      }
    })
  }

  randomize() {
    const text = nanoid(48)
    this.string = encoder.encode(text)
    const displayText = splitInto(text, this.charLimit)
    this.display.text(...displayText)
  }
}
