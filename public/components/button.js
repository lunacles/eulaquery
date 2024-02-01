import {
  Element,
} from '../elements.js'

import ClickRegion from './clickregion.js'

import { mouse } from '../event.js'

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
      x: this.x - this.width * 0.5, y: this.y - this.height * 0.5,
      width: this.width * 2, height: this.height * 2,
    })

    if (this.clickRegion.check() && mouse.left) {
      this.state = !this.state
      this.onUpdate(this.state)
    }

    return this
  }
}

export default Button
