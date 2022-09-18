import { Req } from 'src/lib/connection/request.js'
import { MessagePacket } from 'src/lib/connection/packet.js'
import { Display } from 'src/lib/display.js'
import { Logger } from 'src/lib/debug.js'

const print = new Logger(false, ['[Client]'])
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
  private charLimit: number

  static GET_PACKET_SIZE = Uint8Array.of(0x01, 0x01)
  static PACKET_FRAGMENT = 4

  constructor(private req: Req, private display: Display) {
    this.charLimit = display.screenSize.width / display.fontSize.width
    req.on('dropped', (data) => {})
  }

  async getSize() {
    return new Promise<number>((res, rej) => {
      const handler = (msg: MessagePacket) => {
        console.log('Get message from fuck', msg)
        this.req.off('message', handler)
        const data = msg.data.toTypedArray()
        if (data.byteLength !== 2)
          throw new Error(`Get size reply didn't met the spec`)

        const len = data[1]
        res(len)
      }
      this.req.on('message', handler)
      this.req.reliableSend(Uint8Array.of(0x01, 0x01))
    })
  }

  async getData(num: number) {
    return new Promise<Uint8Array>((res, rej) => {
      const handler = (msg: MessagePacket) => {
        this.req.off('message', handler)
        const data = msg.data.toTypedArray()
        res(data)
      }
      this.req.on('message', handler)
      this.req.reliableSend(Uint8Array.of(0x02, num))
    })
  }

  async getRandom() {
    this.display.header('Getting size...')
    const size = await this.getSize()
    let string = new Uint8Array(0)
    for (let i = 1; i <= size; i++) {
      this.display.header(`Getting #${i} fragment...`)
      const data = await this.getData(i)
      string = new Uint8Array([...string, ...data])
    }

    this.display.header(`Done fetching text!`)
    const text = decoder.decode(string)
    this.display.text(...splitInto(text, this.charLimit))
  }
}
