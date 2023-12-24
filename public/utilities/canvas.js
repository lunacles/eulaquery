/**
 * Gets the Canvas and defines useful drawing methods.
 * @class
 * @public
 * @param {HTMLCanvasElement} canvas - The canvas of the page.
 */
const Canvas = class {
  constructor(canvas) {
    this.canvas = canvas
    this.width = 1920
    this.height = 1080
    this.scale = 1

    this.ctx = canvas.getContext('2d')
    this.ctx.lineJoin = 'round'
  }
  /**
   * Resizes the canvas based on the provided dimensions
   * @public
   * @param {Number} width - The new width of the canvas.
   * @param {Number} height - The new height of the canvas.
   * @param {Number} scale - The new scale of the canvas.
   */
  setSize({ width = 0, height = 0, scale = 1 }) {
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
    return width / height
  }
  /**
   * Sets the visible area of a web page
   * @public
   * @param {Number} x
   * @param {Number} y
   * @param {Number} width
   * @param {Number} height
   */
  setViewport({ x = 0, y = 0, width = 0, height = 0 }) {
    let sx = this.width * this.scale / width
    let sy = this.height * this.scale / height
    this.ctx.setTransform(sx, 0, 0, sy, -x * sx, -y * sy)
  }
}

export default Canvas
