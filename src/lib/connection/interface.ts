import { off } from 'process'
import { Address } from './packet.js'

type Callback = (msg: Uint8Array) => void

export interface Connection {
  send(data: Uint8Array): void
  on(event: 'message', callback: Callback): void
  off(event: 'message', callback: Callback): void
  getAddress(): Address
}
