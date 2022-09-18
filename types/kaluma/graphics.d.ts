/**
 * The `graphics` module supports graphic APIs. Use `require('graphics')` to
 * access this module.
 */
declare module 'graphics' {
  interface Font {
    bitmap: Uint8Array
    glyphs: Uint8Array
    width: number
    height: number
    first: number
    last: number
    advanceX: number
    advanceY: number
  }

  /**
   * An instance of `GraphicsContext` provides basic graphic functions including
   * drawing shapes, fonts, images, and etc. All graphic functions depend on the
   * provided primitive drawing functions which draws directly to a graphic device.
   */
  class GraphicsContext {
    /**
     * - **`width`** `<number>` Screen width of the graphic device in pixels.
     * - **`height`** `<number>` Screen height of the graphic device in pixels.
     * - **`options`** `<object>` Graphic context options.
     *
     *   - **`rotation`** `<number>` Rotation of screen. One of `0` (0 degree), `1`
     *       (90 degree in clockwise), `2` (180 degree in clockwise), and `3`
     *       (270 degree in clockwise).
     *   - **`setPixel`** `<function(x: number, y:number, color:number)>` A callback
     *       function to draw a pixel at `x`, `y` with color `color`.
     *   - **`getPixel`** `<function(x:number, y:number): number>` A callback
     *       function to get color value at a pixel `x`, `y`.
     *   - **`fillRect`** `<function(x:number, y:number, w:number, h:number,
     *       color:number)>` A callback function to draw filled rectangle `x`,
     *       `y` with width `w` and height `h` and color `color`. Optional. If
     *       not provided, `setPixel` is used to draw filled rectangle.
     *
     * `GraphicsContext` is instantiated by a _graphic driver_ rather than a
     * user. A graphic driver should provide a method (e.g.
     * `driver.getContext()`) to get an appropriate instance of
     * `GraphicsContext` so that user can draw something with APIs.
     *
     * Here is an example to use `GraphicsContext` of a graphic driver SSD1306.
     *
     * ```javascript
     * const { SSD1306_I2C } = require('ssd1306')
     * const { I2C } = require('i2c')
     * const i2c0 = new I2C(0)
     * const ssd1306 = new SSD1306_I2C(128, 32, i2c0, { rstPin: 19 })
     * const gc = ssd1306.getContext()
     * // use APIs of gc
     * ```
     */
    constructor(
      width: number,
      height: number,
      options?: {
        rotation?: 0 | 1 | 2 | 3
        setPixel?: (x: number, y: number, color: number) => void
        getPixel?: (x: number, y: number) => number
        fillRect?: (
          x: number,
          y: number,
          w: number,
          h: number,
          color: number
        ) => void
      }
    )

    /**
     * - **Returns:** `<number>` Screen width of graphic device in pixels.
     *
     * Returns screen width in pixels.
     */
    getWidth(): number

    /**
     * - **Returns:** `<number>` Screen height of graphic device in pixels.
     *
     * Return screen height in pixels.
     */
    getHeight(): number

    /** Clear the screen buffer. */
    clearScreen(): void

    /**
     * - **`red`** `<number>` Red brightness between 0~255.
     * - **`green`** `<number>` Green brightness between 0~255.
     * - **`blue`** `<number>` Blue brightness between 0~255.
     * - **Returns**: 16-bit color value.
     *
     * Return 16-bit color (5-bit for red, 6-bits for green, 5-bits for blue)
     * value from RGB values.
     */
    color16(red: number, green: number, blue: number): number

    /**
     * - **`color`** `<number>` Color value.
     *
     * Fill the screen buffer with the color.
     */
    fillScreen(color: number): void

    /**
     * - **`rotation`** `<number>` Rotation of screen.
     *
     * Set the rotation of screen.
     */
    setRotation(rotation: 0 | 1 | 2 | 3): void

    /**
     * - **Returns:** `<number>` Rotation of screen.
     *
     * Returns rotation of screen.
     */
    getRotation(): 0 | 1 | 2 | 3

    /**
     * - **`color`** `<number>` Pen color.
     *
     * Set pen color.
     */
    setColor(color: number): void

    /**
     * - **Returns:** `<number>` Pen color.
     *
     * Returns pen color.
     */
    getColor(): number

    /**
     * - **`color`** `<number>` Fill color.
     *
     * Set fill color.
     */
    setFillColor(color: number): void

    /**
     * - **Returns:** `<number>` Fill color.
     *
     * Returns fill color.
     */
    getFillColor(): number

    /**
     * - **`color`** `<number>` Font color.
     *
     * Set font color.
     */
    setFontColor(color: number): void

    /**
     * - **Returns:** `<number>` Font color.
     *
     * Returns font color.
     */
    getFontColor(): number

    /**
     * - **`font`** `<object|null>` Custom font object. If `null` passed, default
     *   font is used.
     *
     *   - **`bitmap`** `<Uint8Array>` Font bitmap data.
     *   - **`glyphs`** `<Uint8Array>` Font glyph data.
     *   - **`width`** `<number>` Font character width.
     *   - **`height`** `<number>` Font character height.
     *   - **`first`** `<number>` ASCII code for first character in this font.
     *   - **`last`** `<number>` ASCII code for last character in this font.
     *   - **`advanceX`** `<number>` Horizontal advance to next character in pixels.
     *   - **`advanceY`** `<number>` Vertical advance to next line in pixels.
     *
     * Set a custom font. If you are interested in developing custom font,
     * please check the [font conversion
     * tool](https://github.com/kaluma-project/kameleon-fontconv).
     */
    setFont(font?: Font)

    /**
     * - **`scaleX`** `<number>` Horizontal scale of font.
     * - **`scaleY`** `<number>` Vertical scale of font.
     *
     * Set font scale.
     */
    setFontScale(x: number, y: number): void

    /**
     * - **`x`** `<number>` coordinate X.
     * - **`y`** `<number>` coordinate Y.
     * - **`color`** `<number>` Pixel color.
     *
     * Draw a pixel at (x, y) coordinate.
     */
    setPixel(x: number, y: number, color: number): void

    /**
     * - **`x`** `<number>` coordinate X.
     * - **`y`** `<number>` coordinate Y.
     * - **Returns:** `<number>` Pixel color at (x, y) coordinate.
     *
     * Get pixel color at (x, y) coordinate.
     */
    getPixel(x: number, y: number): number

    /**
     * - **`x0`** `<number>` coordinate X0.
     * - **`y0`** `<number>` coordinate Y0.
     * - **`x1`** `<number>` coordinate X1.
     * - **`y1`** `<number>` coordinate Y1.
     *
     * Draw a line from (x0, y0) coordinate to (x1, y1) coordinate.
     */

    drawLine(x0: number, y0: number, x1: number, y1: number): void

    /**
     * - **`x`** `<number>` coordinate X.
     * - **`y`** `<number>` coordinate Y.
     * - **`w`** `<number>` Width of rectangle.
     * - **`h`** `<number>` Height of rectangle.
     *
     * Draw a rectangle at (x, y) coordinate of `w` width and `h` height.
     */
    drawRect(x: number, y: number, w: number, h: number): void
    /**
     * - **`x`** `<number>` coordinate X.
     * - **`y`** `<number>` coordinate Y.
     * - **`w`** `<number>` Width of rectangle.
     * - **`h`** `<number>` Height of rectangle.
     *
     * Draw a filled rectangle at (x, y) coordinate of `w` width and `h` height.
     */
    fillRect: typeof this.drawRect

    /**
     * - **`x`** `<number>` coordinate X.
     * - **`y`** `<number>` coordinate Y.
     * - **`r`** `<number>` Radius of circle.
     *
     * Draw a circle at (x, y) coordinate of `r` radius.
     */
    drawCircle(x: number, y: number, r: number): void
    /**
     * - **`x`** `<number>` coordinate X.
     * - **`y`** `<number>` coordinate Y.
     * - **`r`** `<number>` Radius of circle.
     *
     * Draw a filled circle at (x, y) coordinate of `r` radius.
     */

    fillCircle: typeof this.drawCircle

    /**
     * - **`x`** `<number>` coordinate X.
     * - **`y`** `<number>` coordinate Y.
     * - **`w`** `<number>` Width of rectangle.
     * - **`h`** `<number>` Height of rectangle.
     * - **`r`** `<number>` Radius of corner.
     *
     * Draw a rounded rectangle at (x, y) coordinate of `w` width, `h` height
     * and `r` radius corner.
     */
    drawRoundRect(x: number, y: number, w: number, h: number, r: number): void

    /**
     * - **`x`** `<number>` coordinate X.
     * - **`y`** `<number>` coordinate Y.
     * - **`w`** `<number>` Width of rectangle.
     * - **`h`** `<number>` Height of rectangle.
     * - **`r`** `<number>` Radius of corner.
     *
     * Draw a filled and rounded rectangle at (x, y) coordinate of `w` width,
     * `h` height and `r` radius corner.
     */
    fillRoundRect: typeof this.drawRoundRect

    /**
     * - **`x`** `<number>` coordinate X.
     * - **`y`** `<number>` coordinate Y.
     * - **`text`** `<string>` Text string to draw.
     *
     * Draw a text at (x, y) coordinate.
     */

    drawText(x: number, y: number, text: string): void

    /**
     * - **`text`** `<string>` Text to get text bound.
     * - **Returns:** `<object>` Text bound.
     *
     *   - **`width`** `<number>` Width of text.
     *   - **`height`** `<number>` Height of text.
     *
     * Get text bound (width, height) of a given text string.
     */
    measureText(text: string): { width: number; height: number }

    /**
     * - **`x`** `<number>` coordinate X.
     * - **`y`** `<number>` coordinate Y.
     * - **`bitmap`** `<object>` Bitmap image.
     *
     *   - **`width`** `<number>` Bitmap width.
     *   - **`height`** `<number>` Bitmap height.
     *   - **`bpp`** `<number>` Bits per pixel. Default: `1`.
     *   - **`data`** `<Uint8Array|string>` Bitmap data. If string type is given, it
     *       should be a base64-encoded string. _Note that `Uint8Array` type is
     *       much faster than base64-encoded string._
     * - **`options`** `<object>` Bitmap drawing options
     *
     *   - **`color`** `<number>` Color for 1-bit mono bitmap. Default: `1` for
     *       1-bit bitmap and `0xffff` for 16-bit bitmap.
     *   - **`transparent`** `<number>` Color value to be treated as transparent if defined.
     *   - **`scaleX`** `<number>` Horizontal scale of bitmap. Default: `1`.
     *   - **`scaleY`** `<number>` Vertical scale of bitmap. Default: `1`.
     *   - **`flipX`** `<boolean>` Horizontal flip of bitmap. Default: `false`.
     *   - **`flipY`** `<boolean>` Vertical flip of bitmap. Default: `false`.
     */
    drawBitmap(
      x: number,
      y: number,
      bitmap: {
        width: number
        height: number
        bpp: number
        data: Uint8Array | string
      },
      options?: {
        color?: number
        transparent?: number
        scaleX?: number
        scaleY?: number
        flipX?: boolean
        flipY?: boolean
      }
    ): void
  }

  /**
   * Draw a bitmap image at (x, y) coordinate. The bitmap is drawn with current
   * color in case of 1-bit bitmap.
   */
  class BufferedGraphicsContext extends GraphicsContext {
    constructor(
      width: number,
      height: number,
      options?: {
        rotation?: 0 | 1 | 2 | 3
        bpp?: number
        display?: (buffer: Uint8Array) => void
      }
    )

    /**
     * - `<Uint8Array>`
     *
     * Internal graphic buffer.
     */
    buffer: Uint8Array

    /** Display the graphics by pushing the graphic buffer to the driver. */
    display(): void
  }
}
