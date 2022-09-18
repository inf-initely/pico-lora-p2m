import { expect, use } from 'chai'
import LinkControl from './data-link.js'
import { DataLink } from './interface.js'

type Callback = (data: Uint8Array) => void
class DataLinkMock implements DataLink {
  constructor(public writeTo: Uint8Array[]) {}

  events: Record<string, Callback> = {}

  write(data: Uint8Array): void {
    this.writeTo.push(data)
  }

  mockIncoming(data: Uint8Array) {
    this.events['data'](data)
  }

  addListener(event: 'data', callback: Callback): void {
    this.events[event] = callback
  }

  removeListener = (event: string, listener: Callback) => {
    delete this.events[event]
  }

  on = this.addListener.bind(this)
  off = this.removeListener.bind(this)
  once: this['addListener']
  emit<T extends any[]>(eventName: string, ...args: T): void {
    //@ts-ignore
    this.events[eventName]?.(...args)
  }
  removeAllListeners(eventName: string): void {
    throw new Error('Method not implemented.')
  }
  listeners(eventName: string): ((...args: any[]) => void)[] {
    throw new Error('Method not implemented.')
  }
  listenerCount(eventName: string): number {
    throw new Error('Method not implemented.')
  }
}

const a = (inp: Uint8Array) => Array.from(inp)
const b = (...args: number[]) => Uint8Array.of(...args)

describe('LinkControl Class', () => {
  const incoming: Uint8Array[] = []
  const outgoing: Uint8Array[] = []
  const mockUart = new DataLinkMock(outgoing)
  const linkControl = new LinkControl(mockUart)

  const handler = (packet: Uint8Array) => incoming.push(packet)

  beforeEach(() => {
    linkControl.on('message', handler)
  })

  afterEach(() => {
    linkControl.off('message', handler)
    incoming.splice(0)
    outgoing.splice(0)
  })

  describe('Outgoing message handling', () => {
    it('Should handle normal case', () => {
      linkControl.send(b(1, 2, 3, 4, 5))
      expect(outgoing).to.have.length(1)
      expect(outgoing[0][0]).to.be.equal(0x17)
      expect(outgoing[0].subarray(-1)[0]).to.be.equal(0x1e)
      expect(
        a(outgoing[0].subarray(1, -1).subarray(0, 5))
      ).to.have.ordered.members([1, 2, 3, 4, 5])
    })

    it('Should escape special characters', () => {
      linkControl.send(b(1, 2, 3, 4, 5, 0x17, 0x17, 6, 7, 8, 9, 0x1e))
      expect(outgoing).to.have.length(1)
      expect(outgoing[0][0]).to.be.equal(0x17)
      expect(outgoing[0].subarray(-1)[0]).to.be.equal(0x1e)
      expect(
        a(outgoing[0].subarray(1, -1).subarray(0, 15))
      ).to.have.ordered.members([
        1, 2, 3, 4, 5, 0x1b, 0x07, 0x1b, 0x07, 6, 7, 8, 9, 0x1b, 0x0e,
      ])
    })
  })

  describe('Incoming message handling', () => {
    it('Should handle normal case', () => {
      mockUart.mockIncoming(
        b(0x17, 1, 2, 3, 4, 5, 0x47, 0x0b, 0x99, 0xf4, 0x1e)
      )
      expect(incoming).to.have.length(1)
      expect(a(incoming[0])).to.have.ordered.members([1, 2, 3, 4, 5])
    })

    it('Should escape special characters', () => {
      // decoded: 1, 2, 0x17, 0x1b, 6, 7, 0x1e
      mockUart.mockIncoming(
        b(
          0x17,
          1,
          2,
          0x1b,
          0x07,
          0x1b,
          0x0b,
          6,
          7,
          0x1b,
          0x0e,
          0x92,
          0xc8,
          0x39,
          0xdb,
          0x1e
        )
      )
      expect(incoming).to.have.length(1)
      expect(a(incoming[0])).to.have.ordered.members([
        1, 2, 0x17, 0x1b, 6, 7, 0x1e,
      ])
    })

    it('Should escape special characters', () => {
      // decoded: 1, 2, 0x17, 0x1b, 6, 7, 0x1e
      mockUart.mockIncoming(
        b(
          0x17,
          1,
          2,
          0x1b,
          0x07,
          0x1b,
          0x0b,
          6,
          7,
          0x1b,
          0x0e,
          0x92,
          0xc8,
          0x39,
          0xdb,
          0x1e
        )
      )
      expect(incoming).to.have.length(1)
      expect(a(incoming[0])).to.have.ordered.members([
        1, 2, 0x17, 0x1b, 6, 7, 0x1e,
      ])
    })

    it('Should escape special characters in checksum', () => {
      // decoded: 1, 0xa5, 0x05, 0xdf, 0x1b
      mockUart.mockIncoming(b(0x17, 1, 0xa5, 0x05, 0xdf, 0x1b, 0x0b, 0x1e))
      expect(incoming).to.have.length(1)
      expect(a(incoming[0])).to.have.ordered.members([1])
    })

    it('Should escape special characters in checksum and payload', () => {
      // decoded: 0x01,0x17,0x1e,0xff,0xc5
      mockUart.mockIncoming(
        b(
          0x17,
          0x01,
          0x1b,
          0x07,
          0x1b,
          0x0e,
          0xff,
          0xc5,
          0x58,
          0x1b,
          0x0e,
          0xf4,
          0xbc,
          0x1e
        )
      )
      expect(incoming).to.have.length(1)
      expect(a(incoming[0])).to.have.ordered.members([
        0x01, 0x17, 0x1e, 0xff, 0xc5,
      ])
    })
  })
})

// // should result in 2,3,4,0,5,6,7,8,9
// stream.write(b(0, 0, 0, 0, 0, 1, 2, 3, 4))
// stream.write(b(0))
// stream.write(b(5, 6, 7, 8, 9))
// stream.write(b(4))
// stream.write(b(0, 0))

// // should be scrapped
// stream.write(b(1, 2, 3, 4, 5, 6, 7, 8, 9))
// stream.write(b(0, 0))
// stream.write(b(10, 11, 4))
// stream.write(b(0, 0))

// // should result in 4,5,6,7,8,9,10,7,0,0,10,11
// stream.write(b(0))
// stream.write(b(0))
// stream.write(b(1, 4, 5, 6, 7, 8, 9, 10, 7))
// stream.write(b(0, 0))
// stream.write(b(10, 11, 4))
// stream.write(b(0, 0))
