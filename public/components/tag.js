import global from '../global.js'
import {
  Element,
  Text,
  Bar,
} from '../elements.js'
import Interpolator from './interpolation.js'
import ClickRegion from './clickregion.js'

import { mouse } from '../event.js'

const Tag = class extends Element {
  static create({ label = '', type = '' }) {
    return new Tag(label, type)
  }
  constructor(label, type) {
    super()
    this.label = label
    this.type = type

    this.width = 0
    this.active = true

    this.clickRegion = ClickRegion.create()
    this.interpolationX = Interpolator.create({ speed: 0.4, sharpness: 6 })
    this.interpolationY = Interpolator.create({ speed: 0.6, sharpness: 6 })
  }
  draw({ x = 0, y = 0, size = 0 }) {
    let label = this.label.length <= 30 ? this.label : this.label.slice(0, 30) + "..."
    let width = this.measureText(label, size).width
    this.width = width + size
    Bar.draw({
      x: x - width * 0.5, y: y - size * 0.5,
      width, height: size,
    }).fill(global.colors.burple)
    Text.draw({
      x, y: y - size * 0.25,
      size: size * 0.8,
      text: label,
      align: 'center',
    }).fill(global.colors.white)

    this.clickRegion.update({
      x: x - width * 0.5 - size * 0.5, y: y - size,
      width: width + size, height: size
    })

    if (this.clickRegion.check() && mouse.left && !global.clickOverride) {
      this.active = false
      // Really scuffed bug fix
      mouse.left = false
    }
  }
}

export default Tag
