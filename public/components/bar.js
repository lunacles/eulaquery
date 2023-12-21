import {
  Element,
  Line,
} from '../elements.js'

const Bar = class extends Element {
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

export default Bar
