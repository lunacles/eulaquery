import {
  Element,
} from '../elements.js'
import global from '../global.js'

import Variable from './variable.js'

const TextObj = class extends Element {
  static create(font = `${global.font.style} ${global.font.size}px ${global.font.family}`) {
    return new TextObj(font)
  }
  static textMeasurer = document.createElement('canvas').getContext('2d')
  static measureText(text, size) {
    if (TextObj.textMeasurer.font !== `${global.font.style} ${size}px ${global.font.family}`)
      TextObj.textMeasurer.font = `${global.font.style} ${size}px ${global.font.family}`

    return TextObj.textMeasurer.measureText(text)
  }
  constructor(font) {
    super()

    this.x = 0
    this.y = 0
    this.size = 0
    this.align = 'center'
    this.text = new Variable({
      value: '',
      mutable: true,
    })
    this.font = new Variable({
      value: font,
      mutable: true,
      staticType: true,
    })
    this.fillStyle = new Variable({
      value: null,
      mutable: true,
    })
    this.strokeStyle = new Variable({
      value: null,
      mutable: true,
    })
    this.lineWidth = new Variable({
      value: 0,
      mutable: true,
    })

    this.textctx = document.createElement('canvas').getContext('2d')

    this.textWidth = 0
    this.realWidth = 0
    this.realHeight = 0
  }
  draw({ x = 0, y = 0, size = 0, text = null, align = 'center', font = this.font.value }) {
    if (!text) return this

    this.x = x
    this.y = y
    this.size = size
    this.align = align

    this.setCache('text', ({ fill = null, stroke = null, lineWidth = null, }) => {
      let fontUpdated = !this.font.compare(font)
      this.font.value = font
      let textUpdated = !this.text.compare(text)
      this.text.value = text

      let styleUpdated = !this.fillStyle.compare(fill) || !this.strokeStyle.compare(stroke) || !this.lineWidth.compare(lineWidth)
      this.fillStyle.value = fill
      this.strokeStyle.value = stroke
      this.lineWidth.value = lineWidth

      if (textUpdated || styleUpdated || fontUpdated) {
        this.textWidth = TextObj.measureText(text, this.size).width
        let width = this.textWidth + 2 * lineWidth

        if (styleUpdated || fontUpdated || this.ctxWidth < width || this.ctxWidth > width * 2.5) {
          this.ctxWidth = width * 1.25
          this.ctxHeight = this.size + 2 * lineWidth
          this.textctx.canvas.width = this.ctxWidth
          this.textctx.canvas.height = this.ctxHeight
          this.textctx.font = `${global.font.style} ${this.size}px ${global.font.family}`
          this.textctx.lineCap = 'round'
          this.textctx.lineJoin = 'round'
        } else {
          this.textctx.clearRect(0, 0, this.ctxWidth, this.ctxHeight)
        }

        let ox = (this.ctxWidth - this.textWidth) * 0.5
        let oy = this.ctxHeight * 0.75
        if (stroke != null) {
          this.textctx.strokeStyle = stroke
          this.textctx.lineWidth = lineWidth
          this.textctx.strokeText(this.text.value, ox, oy)
        }
        if (fill != null) {
          this.textctx.fillStyle = fill
          this.textctx.fillText(this.text.value, ox, oy)
        }
      }

      this.x -= this.ctxWidth * 0.5 + this.textWidth * (this.align === 'left' ? -0.5 : this.align === 'right' ? 0.5 : 0)
      this.y -= this.ctxHeight * 0.5
      this.ctx.drawImage(this.textctx.canvas, this.x, this.y)
    })
    return this
  }
}

export default TextObj
