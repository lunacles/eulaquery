import Interaction from '../interaction.js'

import {
  Rect
} from '../elements.js'

const ClickRegion = class {
  static create({ x = 0, y = 0, width = 0, height = 0 } = {}) {
    return new ClickRegion(x, y, width, height)
  }
  constructor(x, y, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height

    this.active = true
  }
  update({ x = 0, y = 0, width = 0, height = 0, debug = false } = {}) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height

    if (debug) {
      Rect.draw({
        x: x, y,
        width, height
      }).stroke('#ff0000', 1)
    }
  }
  check() {
    if (!this.active) return false
    return Interaction.mouse.x >= this.x && Interaction.mouse.x < this.x + this.width && Interaction.mouse.y >= this.y && Interaction.mouse.y < this.y + this.height
  }
  toggle(state) {
    this.active = state
  }
}

export default ClickRegion
