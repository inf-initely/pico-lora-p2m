import { EventEmitter } from 'events'
import { off } from 'process'
import { UART } from 'uart'
import { NetworkError } from './error.js'
import { Address } from './packet.js'

export interface Connection extends EventEmitter {
  send(data: Uint8Array): void
  addListener(event: 'dropped', callback: (data: NetworkError) => void): void
  addListener(event: 'message', callback: (data: Uint8Array) => void): void
  addListener(event: 'error', callback: (e: Error) => void): void

  on: this['addListener']
  off: this['addListener']
  once: this['addListener']
  removeListener: this['addListener']

  getAddress(): Address
}

const a = new UART(0)
a.write

export interface DataLink extends EventEmitter {
  write(data: Uint8Array): void
  addListener(event: 'data', callback: (data: Uint8Array) => void): void
  on: this['addListener']
  off: this['addListener']
  once: this['addListener']
  removeListener: this['addListener']
}
