import { EventEmitter } from 'events'

class Sequence {
  private findings: number[] = []

  constructor(
    private lookup: ArrayLike<any>,
    private getIndex: () => number,
    private onFind: (startIndex: number, endIndex: number) => void
  ) {}

  test(input: any) {
    let isFound = false
    // for each findings, we look for any of the finding
    // that fullfill the sequence
    for (const index in this.findings) {
      // get the test material based on finding index
      const against = this.lookup[this.findings[index]]
      if (input === against) {
        this.findings[index]++
      } else {
        // if test fail, then prepare the finding to be scrapped
        this.findings[index] = -1
        // skip, no point in continuing...
        continue
      }

      // if the finding met the requirement,
      if (this.findings[index] >= this.lookup.length) {
        const index = this.getIndex()
        // then fire the callback
        this.onFind(index - this.lookup.length + 1, index + 1)
        // then reset the sequence
        isFound = true
        break
      }
    }

    if (isFound) {
      this.reset()
    }

    // if reset didn't happen, then cleanup the finding
    // filter all the findings which equals to -1
    this.findings = this.findings.filter((v) => v !== -1)

    // if input equal to lookup starting item, then we push a new finding
    if (input === this.lookup[0]) this.findings.push(1)
  }

  reset() {
    // this.index = 0
    this.findings = []
  }
}

export class PacketStream extends EventEmitter {
  static DETECT_LIMIT = 2

  private head: Sequence
  private tail: Sequence

  private start: number | null = null
  private end: number | null = null

  private cursor = 0
  private buffer = new Uint8Array(128)

  constructor() {
    super()
    const getIndex = () => this.cursor

    this.head = new Sequence(
      Uint8Array.of(0x00, 0x00, 0x01),
      getIndex,
      (start, end) => {
        // console.log(
        //   `Got head sequence: ${this.buffer.subarray(
        //     start,
        //     end
        //   )} (${start}, ${end})`
        // )
        this.start = end
      }
    )

    this.tail = new Sequence(
      Uint8Array.of(0x04, 0x00, 0x00),
      getIndex,
      (start, end) => {
        // console.log(
        //   `Got tail sequence: ${this.buffer.subarray(
        //     start,
        //     end
        //   )} (${start}, ${end})`
        // )
        if (this.start == null) return

        this.end = start
        this.emit('packet', this.buffer.subarray(this.start, this.end))
        this.reset()
      }
    )
  }

  reset() {
    this.start = null
    this.end = null
    this.cursor = 0
    this.buffer = new Uint8Array(128)
    this.head.reset()
    this.tail.reset()
  }

  write(chunk: Uint8Array) {
    // console.log(chunk)
    for (const index in chunk) {
      const byte = chunk[index]
      this.buffer[this.cursor] = byte
      // console.log(byte)

      this.head.test(byte)
      this.tail.test(byte)
      this.cursor++

      // // if start is met, and
      // if (this.start != null) {
      //   // if byte is ZERO,
      //   if (byte === 0) {
      //     // then add to tail count
      //     this.tailCount++
      //     this.headCount++
      //     console.log('Got TAIL, current count:', this.tailCount)

      //     // if tail count met the required limit,
      //     if (this.tailCount >= PacketStream.DETECT_LIMIT) {
      //       // then mark the end,
      //       this.end = this.cursor - this.tailCount
      //       // emit the packet,
      //       this.emit('packet', this.buffer.subarray(this.start, this.end + 1))
      //       // reset the cursor
      //       this.cursor = 0
      //       // reset the buffer,
      //       this.buffer = new Uint8Array(128)
      //       // reset the end and start
      //       this.end = null
      //       this.start = null
      //       this.tailCount = 0
      //     }
      //     continue
      //   }
      //   // else if byte is not ZERO, and
      //   else {
      //     // if tail count is still under the detect limit,
      //     if (this.tailCount < PacketStream.DETECT_LIMIT) {
      //       // then reset the tail count back to zero
      //       this.tailCount = 0
      //       this.headCount = 0
      //       continue
      //     }
      //     // if tail count met the required limit,
      //     else {
      //       // then mark the end,
      //       this.end = this.cursor - this.tailCount
      //       // emit the packet,
      //       this.emit('packet', this.buffer.subarray(this.start, this.end + 1))
      //       // reset the buffer,
      //       this.buffer = new Uint8Array(128)
      //       // reset the cursor
      //       this.cursor = 0
      //       // mark the start,
      //       this.start = this.cursor
      //       this.headCount = 0
      //       // then lastly, reset
      //       this.end = null
      //       this.tailCount = 0
      //       continue
      //     }
      //   }
      // }
      // // if start is not met,
      // else if (this.start == null) {
      //   // and byte is ZERO,
      //   if (byte === 0) {
      //     // then add to head count
      //     this.headCount++
      //     console.log('Got HEAD, current count:', this.headCount)
      //     continue
      //   }
      //   // and byte is not ZERO,
      //   else {
      //     // if head count is still under the detect limit,
      //     if (this.headCount < PacketStream.DETECT_LIMIT) {
      //       // then reset the head count back to zero
      //       this.headCount = 0
      //       continue
      //     }
      //     // if head count met the required limit,
      //     else {
      //       // then mark the start
      //       this.start = this.cursor
      //       this.headCount = 0
      //       console.log('Start marked at index:', this.start)
      //       continue
      //     }
      //   }
      // }
    }
  }
}
