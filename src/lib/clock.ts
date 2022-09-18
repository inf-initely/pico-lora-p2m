import { EventEmitter } from 'events'

export class Clock extends EventEmitter {
  offset = 0

  setOffset(offset: number) {
    this.offset = offset
    return this
  }

  getOffset() {
    return this.offset
  }

  get now() {
    return millis() + this.offset
  }
}
