const Canvas = class {
  constructor(canvas) {
    this.canvas = canvas
    this.width = 1920
    this.height = 1080
    this.scale = 1

    this.ctx = canvas.getContext('2d')
    this.ctx.lineJoin = 'round'
  }
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
  setViewport({ x = 0, y = 0, width = 0, height = 0 }) {
    let sx = this.width * this.scale / width
    let sy = this.height * this.scale / height
    this.ctx.setTransform(sx, 0, 0, sy, -x * sx, -y * sy)
  }
}

export default Canvas
