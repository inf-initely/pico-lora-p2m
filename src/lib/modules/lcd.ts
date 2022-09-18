// import { BufferedGraphicsContext } from 'graphics'
// import { I2C } from 'i2c'
// import { SPI } from 'spi'

// module SSD1306 {
//   class WithI2C extends I2C {
//     resetPin: number
//     address: number
//     externalVcc: boolean
//     rotation: number

//     constructor(
//       bus: number,
//       options?: ConstructorParameters<typeof I2C>[1] & {
//         resetPin?: number
//         address?: number
//         externalVcc?: boolean
//         rotation?: 0 | 1 | 2 | 3
//       }
//     ) {
//       super(bus, options)
//       const {
//         resetPin = -1,
//         address = 0x3c,
//         externalVcc = false,
//         rotation = 0,
//       } = options ?? {}
//       this.resetPin = resetPin
//       this.address = address
//       this.externalVcc = externalVcc
//       this.rotation = rotation
//     }
//   }
// }

import type { Buffer } from 'buffer'
import { BufferedGraphicsContext, GraphicsContext } from 'graphics'
import { I2C } from 'i2c'
import { Pin } from './pin.js'
// @ts-ignore
import font from 'simple-fonts/lee-sans'
import logo from '../../resources/logo.bmp.json'
import { wait } from '../async.js'

const WIRE_MAX = 128

type Options = {
  width?: number
  height?: number
  resetPin?: number
  address?: number
  externalVcc?: boolean
  rotation?: 0 | 1 | 2 | 3
}

/** SSD1306 class */
export class SSD1306 {
  private options: Options

  constructor(public i2c: I2C, options?: Options) {
    this.options = Object.assign<Options, Options>(
      {
        width: 128,
        height: 64,
        // resetPin: -1,
        address: 0x3c,
        externalVcc: false,
        rotation: 0,
      },
      options ?? {}
    )
  }

  reset() {
    return new Promise<void>((res, rej) => {
      if (this.options.resetPin == null) return
      const pin = new Pin(this.options.resetPin)
      pin.setMode(OUTPUT)
      pin.pulseWrite(HIGH, [1000, 10000])
      res()
    })
  }

  syncSendCommands(cmds: Uint8Array) {
    if (this.options.address == null)
      throw new Error('Address should be set before sending command!')

    for (const cmd of cmds) {
      this.i2c.write(new Uint8Array([0, cmd]), this.options.address)
    }
  }

  sendCommands(cmds: Uint8Array) {
    return new Promise<void>((res, rej) => {
      this.syncSendCommands(cmds)
      res()
    })
  }

  async setup() {
    if (this.options == null) throw new Error('Option should be set first!')
    const setupCmds = new Uint8Array([
      0xae, // 0 disp off
      0xd5, // 1 clk div
      0x80, // 2 suggested ratio
      0xa8,
      this.options.height! - 1, // 3 set multiplex, height-1
      0xd3,
      0x00, // 5 display offset (no-offset)
      0x40, // 7 start line (line #0)
      0x8d,
      this.options.externalVcc! ? 0x10 : 0x14, // 8 charge pump
      0x20,
      0x00, // 10 memory mode
      0xa1, // 12 seg remap 1
      0xc8, // 13 comscandec
      0xda,
      this.options.height! === 64 ? 0x12 : 0x02, // 14 set compins, height==64 ? 0x12:0x02,
      0x81,
      this.options.externalVcc! ? 0x9f : 0xcf, // 16 set contrast
      0xd9,
      this.options.externalVcc! ? 0x22 : 0xf1, // 18 set precharge
      0xdb,
      0x40, // 20 set vcom detect
      0xa4, // 22 display all on
      0xa6, // 23 display normal (non-inverted)
      0x2e, // 24 deactivate scroll
      0xaf, // 25 disp on
    ])
    await this.sendCommands(setupCmds)
    await delay(50)
  }

  on() {
    return new Promise<void>((res) => {
      this.i2c.write(new Uint8Array([0, 0xaf]), this.options.address!)
      res()
    })
  }

  off() {
    return new Promise<void>((res) => {
      this.i2c.write(new Uint8Array([0, 0xae]), this.options.address!)
      res()
    })
  }

  setContrast(contrast: any) {
    return new Promise<void>((res) => {
      this.i2c.write(new Uint8Array([0, 0x81, contrast]), this.options.address!)
      res()
    })
  }

  createGraphicContext() {
    if (this.options == null) throw new Error('Option should be set first!')
    const displayHandler = (buffer: Uint8Array) => {
      const cmds = new Uint8Array([
        0x22, // pages
        0,
        (this.options.height! >> 3) - 1,
        0x21, // columns
        0,
        this.options.width! - 1,
      ])
      this.syncSendCommands(cmds)
      const chunk = new Uint8Array(WIRE_MAX + 1)
      chunk[0] = 0x40
      for (let i = 0; i < buffer.byteLength; i += WIRE_MAX) {
        chunk.set(new Uint8Array(buffer.buffer, i, WIRE_MAX), 1)
        this.i2c.write(chunk, this.options.address!)
      }
    }

    return new BufferedGraphicsContext(
      this.options.width!,
      this.options.height!,
      {
        rotation: this.options.rotation!,
        bpp: 1,
        display: displayHandler,
      }
    )
  }
}

/**
 * Perform mono graphic showcase
 *
 * @param {GraphicContext} gc
 */
export async function showcase(gc: BufferedGraphicsContext, interval: number) {
  // start
  gc.clearScreen()
  gc.setFontColor(1)
  gc.drawText(0, 0, 'Graphics Examples')
  gc.display()
  await wait(interval)

  // pixels
  gc.clearScreen()
  for (let x = 0; x < gc.getWidth(); x += 5) {
    for (let y = 0; y < gc.getHeight(); y += 5) {
      gc.setPixel(x, y, 1)
    }
  }
  gc.display()
  await wait(interval)

  // lines
  gc.clearScreen()
  gc.setColor(1)
  for (let x = 0; x < gc.getWidth(); x += 5) {
    gc.drawLine(0, 0, x, gc.getHeight() - 1)
    gc.drawLine(gc.getWidth() - 1, 0, x, gc.getHeight() - 1)
  }
  gc.display()
  await wait(interval)

  // rectangles
  gc.clearScreen()
  gc.setColor(1)
  for (let x = 0; x < gc.getWidth(); x += 5) {
    if (x * 2 < Math.min(gc.getHeight(), gc.getWidth())) {
      gc.drawRect(x, x, gc.getWidth() - x * 2, gc.getHeight() - x * 2)
    }
  }
  gc.display()
  await wait(interval)

  // filled rectangles
  gc.clearScreen()
  gc.setFillColor(1)
  for (let x = 0; x < gc.getWidth(); x += 10) {
    for (let y = 0; y < gc.getWidth(); y += 10) {
      if (((x + y) / 10) % 2 === 0) {
        gc.fillRect(x, y, 10, 10)
      }
    }
  }
  gc.display()
  await wait(interval)

  // circles
  gc.clearScreen()
  gc.setFillColor(1)
  for (let x = 0; x < gc.getWidth(); x += 30) {
    for (let y = 0; y < gc.getWidth(); y += 30) {
      gc.drawCircle(x + 15, y + 15, 14)
      gc.fillCircle(x + 15, y + 15, 8)
    }
  }
  gc.display()
  await wait(interval)

  // round rectangles
  gc.clearScreen()
  gc.setFillColor(1)
  for (let x = 0; x < gc.getWidth(); x += 30) {
    for (let y = 0; y < gc.getWidth(); y += 20) {
      gc.drawRoundRect(x, y, 28, 18, 5)
      gc.fillRoundRect(x + 3, y + 3, 22, 12, 4)
    }
  }
  gc.display()
  await wait(interval)

  // font
  gc.clearScreen()
  gc.setFontColor(1)
  gc.drawText(
    0,
    0,
    "ABCDEFGHIJKLMN\nOPQRSTUVWXYZ\nabcdefghijklmn\nopqrstuvwxyz\n0123456789\n~!@#$%^&*()-=_+\n[]{}\\|:;'<>/?.,"
  )
  gc.display()
  await wait(interval)

  // font scale
  gc.clearScreen()
  gc.setFontColor(1)
  gc.setFontScale(3, 3)
  gc.drawText(
    0,
    0,
    "ABCDEFGHIJKLMN\nOPQRSTUVWXYZ\nabcdefghijklmn\nopqrstuvwxyz\n0123456789\n~!@#$%^&*()-=_+\n[]{}\\|:;'<>/?.,"
  )
  gc.display()
  gc.setFontScale(1, 1)
  await wait(interval)

  // custom font
  gc.clearScreen()
  gc.setFontColor(1)
  gc.setFont(font)
  gc.setFontScale(1, 1)
  gc.drawText(0, 0, 'Custom Font\n"Lee Sans"\nVariable-width Font')
  gc.display()
  await wait(interval)

  // bitmap (logo)
  gc.clearScreen()
  gc.setColor(1)
  let x = Math.floor((gc.getWidth() - logo.width) / 2)
  let y = Math.floor((gc.getHeight() - logo.height) / 2)
  gc.drawBitmap(x, y, logo)
  gc.display()
}
