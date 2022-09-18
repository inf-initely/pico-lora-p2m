import { BufferedGraphicsContext } from 'graphics'
import { assert, assertPrimitive } from './validator.js'

export class Display {
  fontSize: ReturnType<BufferedGraphicsContext['measureText']>
  screenSize: ReturnType<BufferedGraphicsContext['measureText']>
  textRowLimit: number

  constructor(private gc: BufferedGraphicsContext, private headerRowLimit = 2) {
    gc.clearScreen()
    gc.display()
    this.fontSize = gc.measureText('a')
    this.screenSize = {
      width: gc.getWidth(),
      height: gc.getHeight(),
    }
    this.textRowLimit =
      Math.floor(this.screenSize.height / this.fontSize.height) - headerRowLimit
  }

  private clear(x: number, y: number, w: number, h: number) {
    this.gc.setFillColor(0)
    this.gc.fillRect(x, y, w, h)
    this.gc.setFillColor(1)
  }

  /** Clear row, using 1-based index */
  clearRow(n: number) {
    const height = this.fontSize.height
    // for example, clearing with context:
    // - row: 2
    // - fontheight: 8
    // - width: 128
    // then params:
    // - x: 0
    // - y: height * (n - 1) = 8 * (2 - 1) = 8 * 1 = 8
    // - width: 128
    // - height: 8
    this.clear(0, height * (n - 1), this.screenSize.width, height)
  }

  clearRows(Ns: number[]): void
  clearRows(start: number, end: number): void
  clearRows(...args: [NsOrStart: number[] | number, end?: number]) {
    if (args.length === 1) {
      const Ns = args[0]
      if (!Array.isArray(Ns))
        throw new Error('First parameter is not array of numbers')
      for (const n of Ns) {
        this.clearRow(n)
      }
    }

    const [start, end] = args
    assertPrimitive.number(start)
    assertPrimitive.number(end)
    assert(start <= end, 'End must be equal or higher than start')

    for (let i = start; i <= end; i++) {
      this.clearRow(i)
    }
  }

  private displayText(startRow: number, endRow: number, text: string[]) {
    const limit = endRow - startRow + 1
    if (text.length > limit)
      throw new Error(
        `Displaying text beyond what the header can display (rows limit: ${limit})`
      )

    this.clearRows(startRow, endRow)
    const y = this.fontSize.height * (startRow - 1)
    this.gc.drawText(0, y, text.map((v) => v.replaceAll('\n', '')).join('\n'))
    this.gc.display()
  }

  header(...text: string[]) {
    this.displayText(1, 2, text)
  }

  text(...text: string[]) {
    this.displayText(this.headerRowLimit + 1, this.textRowLimit + 1, text)
  }
}
