import { EventEmitter } from 'events'
import { UART } from 'uart'
import { Pin } from '../pin.js'
import { Config, Mode, Version } from './constant.js'
import { wait } from '../../async.js'
import { IllegalOperationError } from '../../error.js'
import { Address } from '../../connection/packet.js'
import { Connection } from 'src/lib/connection/interface.js'
import LinkControl from 'src/lib/connection/data-link.js'
import { Logger } from 'src/lib/debug.js'
import { NetworkError } from 'src/lib/connection/error.js'

const TIMEOUT_LIMIT = 1000
const print = new Logger(false, ['[LoRaE32]'])

export class LoRaE32 extends EventEmitter implements Connection {
  m0: Pin
  m1: Pin
  aux: Pin

  static PACKET_GET_CONFIG = new Uint8Array([0xc1, 0xc1, 0xc1])
  static MODE = Mode

  private mode: Mode = Mode.SLEEP
  private auxWatcherId?: number
  // private queue = new PQueue({ concurrency: 1 })

  private config: Config | null = null
  private version: Version | null = null

  private isSetup: false
  private link: LinkControl

  constructor(
    private uart: UART,
    public options: {
      m0: number
      m1: number
      aux: number
      // dataSize?: number
      // buffer?: number
    }
  ) {
    super()
    // const { dataSize = 48 } = options
    // const { buffer = 48 } = options
    this.m0 = new Pin(options.m0)
    this.m1 = new Pin(options.m1)
    this.aux = new Pin(options.aux)

    this.m0.setMode(OUTPUT)
    this.m1.setMode(OUTPUT)
    this.aux.setMode(INPUT_PULLUP)

    print.log('Starting LoRaE32 raw packet listener.')
    this.link = new LinkControl(uart)
    this.link.on('message', (data: Uint8Array) => {
      this.emit('message', data)
    })
    this.link.on('error', (e) => {
      this.emit('error', e)
    })
    this.link.on('dropped', (e) => {
      this.emit('dropped', e)
    })
  }

  async setup() {
    await this.setMode(Mode.SLEEP)
    this.config = await this.readParameters()
    this.version = await this.readVersion()
  }

  ready() {
    return this.aux.digitalRead()
  }

  async setMode(mode: Mode) {
    const m = (
      {
        [Mode.NORMAL]: [LOW, LOW],
        [Mode.WAKE_UP]: [HIGH, LOW],
        [Mode.POWER_SAVING]: [LOW, HIGH],
        [Mode.SLEEP]: [HIGH, HIGH],
      } as const
    )[mode]

    this.m0.digitalWrite(m[0])
    this.m1.digitalWrite(m[1])

    print.log(`Changing LoRa mode to ${Mode[mode]} (${mode})`)
    this.mode = mode
    this.emit('mode', mode)
  }

  private async receive(packetLength: number) {
    return new Promise<Uint8Array>((res, rej) => {
      const buf = new Uint8Array(packetLength)
      let cursor = 0
      const handler = (data: Uint8Array) => {
        buf.set(data, cursor)
        cursor += data.byteLength
        if (cursor >= packetLength) {
          this.uart.off('data', handler)
          res(buf)
        }
      }
      this.uart.on('data', handler)
    })
  }

  private assertReady() {
    if (this.isSetup == false) throw new Error('Module is not setup yet!')
  }

  private assertSleepMode() {
    if (this.mode !== Mode.SLEEP)
      throw new IllegalOperationError(
        'Reading parameters while not in sleep mode'
      )
  }

  async waitQueue() {
    return new Promise<void>((res) => {
      // this.queue.once('idle', () => {
      res()
      // })
    })
  }

  private async readParameters(): Promise<Config> {
    // return this.queue.add(async () => {
    this.assertSleepMode()

    this.uart.write(LoRaE32.PACKET_GET_CONFIG)
    const result = await this.receive(6)
    return Config.from(result).assert()
  }

  getConfig() {
    this.assertReady()
    // console.log(this.config)
    return Object.assign(new Config(), this.config)
  }

  getAddress() {
    this.assertReady()
    return new Address(this.config!)
  }

  async setConfig(config: Config) {
    this.assertSleepMode()
    // await this.queue.add(async () => {
    // Config.parse(config)

    const data = new Uint8Array([
      // HEAD
      config.header,
      // ADDH
      config.highAddress,
      // ADDL
      config.lowAddress,
      // SPED
      config.airRate | config.baudRate | config.parityBit,
      // CHAN
      config.channel,
      // OPTION
      config.FEC |
        config.driveMode |
        config.transmissionMode |
        config.transmissionPower |
        config.wakeUpTime,
    ])
    this.uart.write(data)
    this.config = Config.from(await this.receive(6))
    // })
    // this.config = await this.readParameters()
  }

  async resetConfig() {
    this.assertSleepMode()
    // await this.queue.add(async () => {
    const data = new Uint8Array([0xc4, 0xc4, 0xc4])
    this.uart.write(data)
    await wait(50)
    // })
    this.config = await this.readParameters()
  }

  async readVersion(): Promise<Version> {
    this.assertSleepMode()
    // return this.queue.add(async () => {
    const data = new Uint8Array([0xc3, 0xc3, 0xc3])
    this.uart.write(data)
    const result = await this.receive(4)
    if (result.length !== 4)
      throw new TypeError(`Parameters didn't return exactly 4 bytes`)
    const [header, model, version, features] = Array.from(result) as BuildTuple<
      4,
      [],
      number
    >
    return {
      header: header as any,
      model: model as any,
      version,
      features,
    }
    // })
  }

  getVersion() {
    this.assertReady()
    return this.version
  }

  getMode() {
    this.assertReady()
    return this.mode
  }

  close() {
    if (this.auxWatcherId != null) clearWatch(this.auxWatcherId)
  }

  override addListener(
    eventName: 'dropped',
    listener: (err: NetworkError) => void
  ): void
  override addListener(eventName: 'error', listener: (err: Error) => void): void
  override addListener(eventName: 'mode', listener: (mode: Mode) => void): void
  override addListener(
    eventName: 'message',
    listener: (message: Uint8Array) => void
  ): void
  override addListener(
    eventName: string,
    listener: (...args: any[]) => void
  ): void {
    super.addListener(eventName, listener)
  }

  override on = this.addListener

  send(data: Uint8Array) {
    if (this.mode === Mode.SLEEP)
      throw new IllegalOperationError(
        'Attempt to send data while in sleep mode'
      )

    // set padding for data
    // const d = new Uint8Array([0, 0, 0x01, ...data, 0x04, 0, 0])
    print.log('Sending packet:', data)
    return this.link.send(data)
  }

  write(data: Uint8Array) {
    return this.link.write(data)
  }
}
