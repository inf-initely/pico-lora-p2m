import { PacketStream } from './stream.js'
import { expect, use } from 'chai'

const a = (inp: Uint8Array) => Array.from(inp)
const b = (...args: number[]) => Uint8Array.of(...args)

describe('PacketStream Class', () => {
  const stream = new PacketStream()

  const result: Uint8Array[] = []
  const handler = (packet: Uint8Array) => result.push(packet)

  beforeEach(() => {
    stream.on('packet', handler)
  })

  afterEach(() => {
    stream.off('packet', handler)
    result.splice(0)
  })

  const normal = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  it('Should handle normal case', () => {
    stream.write(b(0, 0, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 4, 0, 0))
    expect(a(result[0])).to.have.same.ordered.members(normal)
  })

  it('Should handle fragmented data', () => {
    // should result in 2,3,4,5,6,0,7,8,9,10
    stream.write(b(0, 0))
    stream.write(b(1, 1, 2, 3))
    stream.write(b(4, 5, 6))
    stream.write(b(7, 8))
    stream.write(b(9, 10, 4, 0, 0, 0))
    expect(a(result[0])).to.have.same.ordered.members(normal)
  })

  it('Should handle continous fragmented data', () => {
    // should result in 2,3,4,5,6,0,7,8,9,10
    stream.write(b(0, 0))
    stream.write(b(1, 1, 2, 3))
    stream.write(b(4, 5, 6))
    stream.write(b(7, 8))
    stream.write(b(9, 10, 4, 0, 0, 0, 0))

    stream.write(b(1, 1, 2, 3, 4, 5))
    stream.write(b(6, 7, 8, 9))
    stream.write(b(10, 4))
    stream.write(b(0, 0, 0))
    stream.write(b(0, 0, 0))
    stream.write(b(0, 0, 0))

    stream.write(b(0, 0, 1))
    stream.write(b(1, 2, 3, 4, 5))
    stream.write(b(6, 7, 8, 9))
    stream.write(b(10, 4))
    stream.write(b(0, 0, 0))
    stream.write(b(0, 0, 0))
    stream.write(b(0, 0, 0))
    stream.write(b(0, 0, 0))

    expect(result).to.have.length(3)
    expect(a(result[0])).to.have.same.ordered.members(normal)
    expect(a(result[1])).to.have.same.ordered.members(normal)
    expect(a(result[2])).to.have.same.ordered.members(normal)
  })

  describe('Skipping head/tail', () => {
    it('Should handle skipping head', () => {
      // should result in 2,3,4,5,6,0,7,8,9,10
      stream.write(b(0, 0))
      stream.write(b(1, 1, 2, 3, 0, 0, 1))
      stream.write(b(9, 10, 11, 0, 0, 1))
      stream.write(b(4, 5, 6, 1, 0, 1, 0))
      stream.write(b(7, 8))
      stream.write(b(9, 10, 4, 0, 0, 0, 0))

      expect(result).to.have.length(1)
      expect(a(result[0])).to.have.same.ordered.members([
        4, 5, 6, 1, 0, 1, 0, 7, 8, 9, 10,
      ])
    })

    it('Should handle skipping tail', () => {
      // should result in 2,3,4,5,6,0,7,8,9,10
      stream.write(b(0, 0))
      stream.write(b(1, 1, 2, 3, 4, 0))
      stream.write(b(0, 4, 0, 0, 0, 1))
      stream.write(b(1, 2, 3))
      stream.write(b(4, 0, 4, 0))
      stream.write(b(9, 10, 4, 0, 0, 0, 0))

      expect(result).to.have.length(2)
      expect(a(result[0])).to.have.same.ordered.members([1, 2, 3])
      expect(a(result[1])).to.have.same.ordered.members([
        1, 2, 3, 4, 0, 4, 0, 9, 10,
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
