import {
  Line,
  Element,
} from '../elements.js'

const X = class extends Element {
  static draw({ x = 0, y = 0, width = 0, height = 0 }) {
    return new X(x, y, width, height)
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
    this.setCache('X', ({ fill, stroke, lineWidth }) => {
      this.ctx.lineCap = 'round'
      Line.draw({
        x1: this.x, y1: this.y,
        x2: this.x + this.width, y2: this.y + this.height
      }).stroke(stroke, lineWidth)
      Line.draw({
        x1: this.x, y1: this.y + this.height,
        x2: this.x + this.width, y2: this.y
      }).stroke(stroke, lineWidth)
    })

    return this
  }
}

export default X
