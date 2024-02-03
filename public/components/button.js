import {
  Element,
} from '../elements.js'

import ClickRegion from './clickregion.js'

import Interaction from '../interaction.js'

const Button = class extends Element {
  static create({ defaultState = false, onUpdate = () => {} } = {}) {
    return new Button(defaultState, onUpdate)
  }
  constructor(defaultState, onUpdate) {
    super()

    this.state = defaultState
    this.onUpdate = onUpdate

    this.x = 0
    this.y = 0
    this.width = 0
    this.height = 0

    this.clickRegion = ClickRegion.create()
  }
  update({ x = 0, y = 0, width = 0, height = 0 }) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height

    this.clickRegion.update({
      x: this.x, y: this.y,
      width: this.width, height: this.height,
    })

    if (this.clickRegion.check() && Interaction.mouse.left) {
      this.state = !this.state
      this.onUpdate(this.state)
    }

    return this
  }
}

export default Button
