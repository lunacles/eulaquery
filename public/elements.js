import global from './global.js'

export const Element = class {
  constructor() {
    this.canvas = document.getElementById('canvas')
    global.canvas = this.canvas
    this.ctx = this.canvas.getContext('2d')
    global.ctx = this.ctx

    this.ctx.lineJoin = 'round'

    this.width = 1920
    this.height = 1080
    this.scale = 1
    this.ctx.globalAlpha = 1

    this.cache = { type: null }
  }
  /**
   * Resets cached data.
   * @private
   */
  resetCache() {
    this.cache = { type: null }
  }
  /**
   * Applies cached data to the current chain.
   * @public
   * @param {String} type - The type of cached data.
   * @param {Function} run - The operation executed with the cached data.
   */
  setCache(type, run) {
    this.cache = {
      type, run,
    }
  }
  /**
   * Sets the globalAlpha and applies it to the current element
   * @public
   * @param {Number} alpha - The opacity to set the current element to
   * @returns {this} The current instance for chaining methods.
   */
  alpha(alpha) {
    if (alpha != null) {
      this.ctx.globalAlpha = alpha
    }

    return this
  }
  /**
   * Sets the fillStyle and fills the current element with a color
   * @public
   * @param {String} fill - The color to set the current element's fillStyle to
   * @returns {this} The current instance for chaining methods.
   */
  fill(fill, alphaReset = true) {
    if (fill != null) {
      this.ctx.fillStyle = fill
      switch (this.cache.type) {
        case 'text':
          this.cache.run({ fill, })
          break
        case 'bar':
          this.cache.run({ fill, })
          break
        default:
          this.ctx.fill()
      }
    }
    if (alphaReset)
      this.ctx.globalAlpha = 1

    this.resetCache()
    return this
  }
  /**
   * Sets the strokeStyle and strokes the current element with a color
   * @public
   * @param {String} stroke    - The color to set the current element's strokeStyle to
   * @param {Number} lineWidth - The width of the stroke applied to the current element
   * @returns {this} The current instance for chaining methods.
   */
  stroke(stroke, lineWidth, alphaReset = true) {
    if (stroke != null) {
      this.ctx.lineWidth = lineWidth
      this.ctx.strokeStyle = stroke
      switch (this.cache.type) {
        case 'text':
          this.cache.run({ stroke, lineWidth })
          break
        case 'bar':
          this.cache.run({ stroke, lineWidth, })
          break
        default:
          this.ctx.stroke()
      }
    }
    if (alphaReset)
      this.ctx.globalAlpha = 1

    this.resetCache()
    return this
  }
  /**
   * Sets the fillStyle/strokeStyle and fills/strokes the current element with the provided color(s)
   * @public
   * @param {String} fill - The color to set the current element's fillStyle to
   * @param {String} stroke    - The color to set the current element's strokeStyle to
   * @param {Number} lineWidth - The width of the stroke applied to the current element
   * @returns {this} The current instance for chaining methods.
   */
  both(fill, stroke, lineWidth) {
    switch (this.cache.type) {
      case 'text':
        this.cache.run({ fill, stroke, lineWidth, })
        break
      case 'bar':
        this.cache.run({ fill, stroke, lineWidth, })
        break
      default:
        this.stroke(stroke, lineWidth, false)
        this.fill(fill, false)
    }
    this.ctx.globalAlpha = 1

    this.resetCache()
    return this
  }
  /**
   * Applies a linear gradient fill to the current element.
   * @public
   * @param {Number} x1 - The starting x-coordinate for the gradient.
   * @param {Number} y1 - The starting y-coordinate for the gradient.
   * @param {Number} x2 - The ending x-coordinate for the gradient.
   * @param {Number} y2 - The ending y-coordinate for the gradient.
   * @param {Array<Object>} gradient - An array of objects defining the gradient stops.
   *    @param {Number} pos - The position of the color stop (between 0 and 1).
   *    @param {String} color - The color at this position in the gradient.
   * @throws {Error} If a color stop position is outside the range 0 to 1.
   * @returns {this} The current instance for chaining methods.
   */
  fillLinearGradient({ x1 = 0, y1 = 0, x2 = 0, y2 = 0, gradient = [] }) {
    if (gradient.length > 0) {
      let fill = this.ctx.createLinearGradient(x1, y1, x2, y2)
      for (let [i, stop] of gradient.entries()) {
        if (stop.pos < 0 || stop.pos > 1) throw Error('Invalid colorstop position.')
        fill.addColorStop(stop.pos, stop.color)
      }

      this.ctx.fillStyle = fill
      this.ctx.fill()
    }

    return this
  }
  /**
   * Applies a radial gradient fill to the current element.
   * @public
   * @param {Number} x1 - The starting x-coordinate for the gradient.
   * @param {Number} y1 - The starting y-coordinate for the gradient.
   * @param {Number} r1 - The starting radius for the gradient.
   * @param {Number} x2 - The ending x-coordinate for the gradient.
   * @param {Number} y2 - The ending y-coordinate for the gradient.
   * @param {Number} r2 - The ending radius for the gradient.
   * @param {Array<Object>} gradient - An array of objects defining the gradient stops.
   *    @param {Number} pos - The position of the color stop (between 0 and 1).
   *    @param {String} color - The color at this position in the gradient.
   * @throws {Error} If a color stop position is outside the range 0 to 1.
   * @returns {this} The current instance for chaining methods.
   */
  fillRadialGradient({ x1 = 0, y1 = 0, r1 = 0, x2 = 0, y2 = 0, r2 = 0, gradient = [] }) {
    if (gradient.length > 0) {
      let fill = this.ctx.createRadialGradient(x1, y1, r1, x2, y2, r2)
      for (let [i, stop] of gradient.entries()) {
        if (stop.pos < 0 || stop.pos > 1) throw Error('Invalid colorstop position.')
        fill.addColorStop(stop.pos, stop.color)
      }

      this.ctx.fillStyle = fill
      this.ctx.fill()
    }

    return this
  }
  /**
   * Applies a linear gradient stroke to the current element.
   * @public
   * @param {Number} x1 - The starting x-coordinate for the gradient.
   * @param {Number} y1 - The starting y-coordinate for the gradient.
   * @param {Number} x2 - The ending x-coordinate for the gradient.
   * @param {Number} y2 - The ending y-coordinate for the gradient.
   * @param {Array<Object>} gradient - An array of objects defining the gradient stops.
   *    @param {Number} pos - The position of the color stop (between 0 and 1).
   *    @param {String} color - The color at this position in the gradient.
   * @throws {Error} If a color stop position is outside the range 0 to 1.
   * @returns {this} The current instance for chaining methods.
   */
  strokeLinearGradient({ x1 = 0, y1 = 0, x2 = 0, y2 = 0, lineWidth = 0, gradient = [] }) {
    if (gradient.length > 0) {
      let stroke = this.ctx.createLinearGradient(x1, y1, x2, y2)
      for (let [i, stop] of gradient.entries()) {
        if (stop.pos < 0 || stop.pos > 1) throw Error('Invalid colorstop position.')
        stroke.addColorStop(stop.pos, stop.color)
      }

      this.ctx.lineWidth = lineWidth
      this.ctx.strokeStyle = stroke
      this.ctx.stroke()
    }

    return this
  }
  /**
   * Applies a radial gradient stroke to the current element.
   * @public
   * @param {Number} x1 - The starting x-coordinate for the gradient.
   * @param {Number} y1 - The starting y-coordinate for the gradient.
   * @param {Number} r1 - The starting radius for the gradient.
   * @param {Number} x2 - The ending x-coordinate for the gradient.
   * @param {Number} y2 - The ending y-coordinate for the gradient.
   * @param {Number} r2 - The ending radius for the gradient.
   * @param {Array<Object>} gradient - An array of objects defining the gradient stops.
   *    @param {Number} pos - The position of the color stop (between 0 and 1).
   *    @param {String} color - The color at this position in the gradient.
   * @throws {Error} If a color stop position is outside the range 0 to 1.
   * @returns {this} The current instance for chaining methods.
   */
  strokeRadialGradient({ x1 = 0, y1 = 0, r1 = 0, x2 = 0, y2 = 0, r2 = 0, lineWidth = 0, gradient = [] }) {
    if (gradient.length > 0) {
      let stroke = this.ctx.createRadialGradient(x1, y1, r1, x2, y2, r2)
      for (let [i, stop] of gradient.entries()) {
        if (stop.pos < 0 || stop.pos > 1) throw Error('Invalid colorstop position.')
        stroke.addColorStop(stop.pos, stop.color)
      }

      this.ctx.lineWidth = lineWidth
      this.ctx.strokeStyle = stroke
      this.ctx.stroke()
    }

    return this
  }
  /**
   * Resizes the canvas based on the provided dimensions
   * @public
   * @param {Number} width - The new width of the canvas.
   * @param {Number} height - The new height of the canvas.
   * @param {Number} scale - The new scale of the canvas.
   */
  resize({ width, height, scale }) {
    if (this.width !== width || this.height !== height || this.scale !== scale) {
      this.width = width
      this.height = height
      this.scale = scale

      let cWidth = Math.ceil(width * scale)
      let cHeight = Math.ceil(height * scale)
      this.canvas.width = cWidth
      this.canvas.height = cHeight
      this.canvas.style.width = `${cWidth / scale}px`
      this.canvas.style.height = `${cHeight / scale}px`

      this.ctx.lineJoin = 'round'
    }
  }
  measureText(text, size) {
    this.ctx.font = `${global.font.style} ${size}px ${global.font.family}`
    return this.ctx.measureText(text)
  }
}

export const Rect = class extends Element {
  /**
   * Creates a new Rect instance and applies the provided dimensions.
   * @public
   * @param {Number} x - The x-coordinate of the rect.
   * @param {Number} y - The y-coordinate of the rect.
   * @param {Number} width - The width of the rect.
   * @param {Number} height - The height of the rect.
   * @returns {Rect} The current instance for chaining methods.
   */
  static draw({ x = 0, y = 0, width = 0, height = 0 }) {
    return new Rect(x, y, width, height)
  }
  constructor(x, y, width, height) {
    super()

    this.x = x
    this.y = y
    this.width = width
    this.height = height

    this.draw()
  }
  /**
   * Draws a rect.
   * @private
   * @returns {this} The current instance for chaining methods.
   */
  draw() {
    this.ctx.beginPath()
    this.ctx.rect(this.x, this.y, this.width, this.height)

    return this
  }
}

export const RoundRect = class extends Element {
  /**
   * Creates a new Rounded Rect instance and applies the provided dimensions.
   * @public
   * @param {Number} x - The x-coordinate of the rect.
   * @param {Number} y - The y-coordinate of the rect.
   * @param {Number} width - The width of the rect.
   * @param {Number} height - The height of the rect.
   * @param {Array} radii - A number or array specifying the radii of the arc to be used for the corners of the rectangle.
   * @returns {RoundRect} The current instance for chaining methods.
   */
  static draw({ x = 0, y = 0, width = 0, height = 0, radii = 0 }) {
    return new RoundRect(x, y, width, height, radii)
  }
  constructor(x, y, width, height, radii) {
    super()

    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.radii = radii

    this.draw()
  }
  /**
   * Draws a rect.
   * @private
   * @returns {this} The current instance for chaining methods.
   */
  draw() {
    this.ctx.beginPath()
    this.ctx.roundRect(this.x, this.y, this.width, this.height, this.radii)

    return this
  }
}

export const Line = class extends Element {
  /**
   * Creates a new Line instance and applies the provided dimensions.
   * @public
   * @param {Number} x1 - The starting x-coordinate of the line.
   * @param {Number} y1 - The starting y-coordinate of the line.
   * @param {Number} x2 - The ending x-coordinate of the line.
   * @param {Number} y2 - The ending y-coordinate of the line.
   * @returns {Line} The current instance for chaining methods.
   */
  static draw({ x1 = 0, y1 = 0, x2 = 0, y2 = 0 }) {
    return new Line(x1, y1, x2, y2)
  }
  constructor(x1, y1, x2, y2) {
    super()

    this.x1 = x1
    this.y1 = y1
    this.x2 = x2
    this.y2 = y2

    this.draw()
  }
  /**
   * Draws a line.
   * @private
   * @returns {this} The current instance for chaining methods.
   */
  draw() {
    this.ctx.beginPath()
    this.ctx.moveTo(this.x1, this.y1)
    this.ctx.lineTo(this.x2, this.y2)

    return this
  }
}

export const Circle = class extends Element {
  /**
   * Creates a new Circle instance and applies the provided dimensions.
   * @public
   * @param {Number} x - The x-coordinate of the circle.
   * @param {Number} y - The y-coordinate of the circle.
   * @param {Number} radius - The radius of the circle.
   * @returns {Circle} The current instance for chaining methods.
   */
  static draw({ x = 0, y = 0, radius = 1 }) {
    return new Circle(x, y, radius)
  }
  constructor(x, y, radius) {
    super()

    this.x = x
    this.y = y
    this.radius = radius

    this.draw()
  }
  /**
   * Draws a circle.
   * @private
   * @returns {this} The current instance for chaining methods.
   */
  draw() {
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)

    return this
  }
}

export const Text = class extends Element {
  /**
   * Creates a new Text instance and caches the data to be drawn when a fill or stroke is applied.
   * @public
   * @param {Number} x - The x-coordinate of the text.
   * @param {Number} y - The y-coordinate of the text.
   * @param {Number} size - The size of the text.
   * @param {String} text - The text of the text.
   * @param {String} align - The alignment of the text.
   * @returns {Text} The current instance for chaining methods.
   */
  static draw({ x = 0, y = 0, size = 0, text = '', align = 'center', }) {
    return new Text(x, y, size, text, align)
  }
  constructor(x = 0, y = 0, size = 0, text = '', align = 'center') {
    super()

    this.x = x
    this.y = y
    this.size = size
    this.text = text
    this.align = align

    this.draw()
  }
  draw() {
    this.ctx.font = `${global.font.style} ${this.size}px ${global.font.family}`
    global.font.size = this.size
    this.ctx.lineCap = 'round'
    this.ctx.lineJoin = 'round'
    this.ctx.textAlign = this.align
    this.ctx.beginPath()
    this.setCache('text', ({ fill = null, stroke = null, lineWidth = null, }) => {
      if (stroke != null) {
        this.ctx.strokeStyle = stroke
        this.ctx.lineWidth = lineWidth
        this.ctx.strokeText(this.text, this.x, this.y)
      }
      if (fill != null) {
        this.ctx.fillStyle = fill
        this.ctx.fillText(this.text, this.x, this.y)
      }
    })

    return this
  }
}

export const Bar = class extends Element {
  /**
   * Creates a new Bar instance and applies the provided dimensions.
   * @public
   * @param {Number} x - The x-coordinate of the Bar.
   * @param {Number} y - The y-coordinate of the Bar.
   * @param {Number} width - The width of the Bar.
   * @param {Number} height - The height of the Bar.
   * @returns {Bar} The current instance for chaining methods.
   */
  static draw({ x = 0, y = 0, width = 0, height = 0 }) {
    return new Bar(x, y, width, height)
  }
  constructor(x, y, width, height) {
    super()

    this.x = x
    this.y = y
    this.width = width
    this.height = height

    this.draw()
  }
  /**
   * Caches a bar to be drawn.
   * @private
   * @returns {this} The current instance for chaining methods.
   */
  draw() {
    this.ctx.beginPath()
    this.setCache('bar', ({ fill, stroke, lineWidth }) => {
      this.ctx.lineCap = 'round'
      Line.draw({
        x1: this.x, y1: this.y,
        x2: this.x + this.width, y2: this.y
      }).stroke(stroke, this.height + lineWidth)
      Line.draw({
        x1: this.x, y1: this.y,
        x2: this.x + this.width, y2: this.y
      }).stroke(fill, this.height)
    })

    return this
  }
}

export const Clip = class extends Element {
  /**
   * Starts clipping a given area within the canvas.
   * @public
   * @param {Number} x - The x-coordinate of the clip.
   * @param {Number} y - The y-coordinate of the clip.
   * @param {Number} width - The width of the clip.
   * @param {Number} height - The height of the clip.
   * @returns {Clip} The current instance for chaining methods.
   */
  static start({ x = 0, y = 0, width = 0, height = 0, }) {
    return new Clip(x, y, width, height)
  }
  /**
   * Ends the clipping of the provided clipping instance.
   * @public
   */
  static end(clip) {
    clip.end()
  }
  constructor(x, y, width, height) {
    super()

    this.x = x
    this.y = y
    this.width = width
    this.height = height

    this.start()
  }
  /**
   * Begins clipping part of the canvas.
   * @private
   * @returns {this} The current instance for chaining methods.
   */
  start() {
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.rect(this.x, this.y, this.width, this.height)
    this.ctx.clip()

    return this
  }
  /**
   * Ends the clipping of the canvas.
   * @private
   * @returns {this} The current instance for chaining methods.
   */
  end() {
    this.ctx.restore()

    return this
  }
}
