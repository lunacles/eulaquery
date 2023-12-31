import global from './global.js'
import Document from './document.js'

export const Element = class {
  constructor() {
    this.canvas = Document.canvas.canvas
    global.canvas = this.canvas
    this.ctx = Document.canvas.ctx
    global.ctx = this.ctx
    this.ctx.globalAlpha = 1
    this.cache = { type: null }
  }
  resetCache() {
    this.cache = { type: null }
  }
  setCache(type, run) {
    this.cache = {
      type, run,
    }
  }
  alpha(alpha) {
    if (alpha != null) {
      this.ctx.globalAlpha = alpha
    }

    return this
  }
  fill(fill, alphaReset = true) {
    if (fill != null) {
      this.ctx.fillStyle = fill

      if (this.cache.type) {
        this.cache.run({ fill, })
      } else {
        this.ctx.fill()
      }
    }
    if (alphaReset)
      this.ctx.globalAlpha = 1

    this.resetCache()
    return this
  }
  stroke(stroke, lineWidth, alphaReset = true) {
    if (stroke != null) {
      this.ctx.lineWidth = lineWidth
      this.ctx.strokeStyle = stroke
      if (this.cache.type) {
        this.cache.run({ stroke, lineWidth, })
      } else {
        this.ctx.stroke()
      }
    }
    if (alphaReset)
      this.ctx.globalAlpha = 1

    this.resetCache()
    return this
  }
  both(fill, stroke, lineWidth) {
    if (this.cache.type) {
      this.cache.run({ fill, stroke, lineWidth, })
    } else {
      this.stroke(stroke, lineWidth, false)
      this.fill(fill, false)
    }
    this.ctx.globalAlpha = 1

    this.resetCache()
    return this
  }
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
  measureText(text, size) {
    this.ctx.font = `${global.font.style} ${size}px ${global.font.family}`
    return this.ctx.measureText(text)
  }
}

export const Rect = class extends Element {
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
  draw() {
    this.ctx.beginPath()
    this.ctx.rect(this.x, this.y, this.width, this.height)

    return this
  }
}

export const RoundRect = class extends Element {
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
  draw() {
    this.ctx.beginPath()
    this.ctx.roundRect(this.x, this.y, this.width, this.height, this.radii)

    return this
  }
}

export const Line = class extends Element {
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
  draw() {
    this.ctx.beginPath()
    this.ctx.moveTo(this.x1, this.y1)
    this.ctx.lineTo(this.x2, this.y2)

    return this
  }
}

export const Circle = class extends Element {
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
  draw() {
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)

    return this
  }
}

export const Text = class extends Element {
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
  static start({ x = 0, y = 0, width = 0, height = 0, }) {
    return new Clip(x, y, width, height)
  }
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
  start() {
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.rect(this.x, this.y, this.width, this.height)
    this.ctx.clip()

    return this
  }
  end() {
    this.ctx.restore()

    return this
  }
}

export const Poly = class extends Element {
  static draw({ x = 0, y = 0, width = 0, height = 0, path = [] }) {
    return new Poly(x, y, width, height, path)
  }
  constructor(x, y, width, height, path) {
    super()

    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.normalizedPath = this.normalize(path)

    this.draw()
  }

  normalize(path) {
    let minX = Math.min(...path.map(p => p[0]))
    let maxX = Math.max(...path.map(p => p[0]))
    let minY = Math.min(...path.map(p => p[1]))
    let maxY = Math.max(...path.map(p => p[1]))

    return path.map(([x, y]) => [
      (x - minX) / (maxX - minX),
      (y - minY) / (maxY - minY)
    ])
  }

  draw() {
    this.ctx.beginPath()
    let first = true
    for (let [nx, ny] of this.normalizedPath) {
      let x = this.x + nx * this.width
      let y = this.y + ny * this.height

      if (first) {
        this.ctx.moveTo(x, y)
        first = false
      } else {
        this.ctx.lineTo(x, y)
      }
    }
    this.ctx.closePath()

    return this
  }
}
