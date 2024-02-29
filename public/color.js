import * as util from './util.js'

const Color = class {
  static hexToRgb(hex = '#ffffff') {
    if (!/^#([0-9A-Fa-f]{3}){1,2}$/.test(hex)) throw new Error('Invalid hex code.')
    hex = hex.toString().replace(/^#/, '')
    if (hex.length === 3)
      hex = hex.split('').map(char => char + char).join('')
    let num = parseInt(hex, 16)
    return [(num >> 16) & 0xFF, (num >> 8) & 0xFF, num & 0xFF]
  }
  static rgbToHex(rgb = [0, 0, 0]) {
    if (!Array.isArray(rgb) || rgb.length !== 3) throw new Error('Invalid rgb code.')
    return rgb.reduce((a, b) => a + (b | 256).toString(16).slice(1), '#')
  }
  static blend(color1, color2, weight2 = 0) {
    if (!(color1 instanceof Color))
      color1 = new Color(color1)
    if (!(color2 instanceof Color))
      color2 = new Color(color2)

    if (weight2 <= 0) return color1.hex
    if (weight2 >= 1) return color2.hex
    let weight1 = 1 - weight2

    let r = Math.round((color1.r * weight1) + (color2.r * weight2))
    let g = Math.round((color1.g * weight1) + (color2.g * weight2))
    let b = Math.round((color1.b * weight1) + (color2.b * weight2))

    return new Color([r, g, b])
  }
  constructor(color) {
    this.color = color

    this.type = typeof this.color === 'string' ? 'hex' : 'rgb'
    this.validate()

    this.hex = this.type === 'hex' ? this.color : Color.rgbToHex(this.color)
    this.rgb = this.type === 'rgb' ? this.color : Color.hexToRgb(this.color)
    this.r = this.rgb[0]
    this.g = this.rgb[1]
    this.b = this.rgb[2]

    this.hue = 0
    this.saturation = 0
    this.value = 0
    this.getHsv()
  }
  validate() {
    if (this.type === 'hex' && !/^#([0-9A-Fa-f]{3}){1,2}$/.test(this.color)) throw new Error('Invalid hex code.')
    if (this.type === 'rgb' && (!Array.isArray(this.color) || this.color.length !== 3)) throw new Error('Invalid rgb code.')
  }
  getHsv() {
    let r = this.r / 255
    let g = this.g / 255
    let b = this.b / 255

    let max = Math.max(r, g, b)
    let min = Math.min(r, g, b)
    let d = max - min

    this.hue = (max === min ? max : (() => {
      let h = this.hue
      switch (max) {
        case r:
          this.hue = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          this.hue = (b - r) / d + 2
          break
        case b:
          this.hue = (r - g) / d + 4
          break
      }
      return h / 6
    })) * 100
    this.saturation = (max === 0 ? 0 : d / max) * 100
    this.value = max * 100
  }
  rotateHue(hue) {
    this.hue = util.clamp(this.hue + hue, 0, 100)
    this.applyHsv()
    return this
  }
  rotateSaturation(saturation) {
    this.saturation = util.clamp(this.saturation + saturation, 0, 100)
    this.applyHsv()
    return this
  }
  rotateValue(value) {
    this.value = util.clamp(this.value + value, 0, 100)
    this.applyHsv()
    return this
  }
  applyHsv() {
    let i = Math.floor(this.hue / 60)
    let f = this.hue / 60 - i
    let p = this.value * (1 - this.saturation)
    let q = this.value * (1 - f * this.saturation)
    let t = this.value * (1 - (1 - f) * this.saturation)
    switch (i % 6) {
      case 0:
        this.r = this.value
        this.g = t
        this.b = p
        break
      case 1:
        this.r = q
        this.g = this.value
        this.b = p
        break
      case 2:
        this.r = p
        this.g = this.value
        this.b = t
        break
      case 3:
        this.r = p
        this.g = q
        this.b = this.value
        break
      case 4:
        this.r = t
        this.g = p
        this.b = this.value
        break
      case 5:
        this.r = this.value
        this.g = p
        this.b = q
        break
    }
    this.r = Math.round(this.r * 255)
    this.g = Math.round(this.g * 255)
    this.b = Math.round(this.b * 255)

    this.rgb = [this.r, this.b, this.g]
    this.hex = Color.rgbToHex(this.color)
  }
}

export default Color
