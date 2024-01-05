import {
    Element,
    Bar,
    Circle
} from '../elements.js'
import Interpolator from './interpolation.js'
import ClickRegion from './clickregion.js'

import global from '../global.js'
import { mouse } from '../event.js'
import * as util from '../util.js'

const Toggle = class extends Element {
  static create(defaultState, onToggle = () => {}) {
    return new Toggle(defaultState, onToggle)
  }
  constructor(defaultState, onToggle) {
    super()

    this.state = defaultState
    this.onToggle = onToggle
    this.x = 0
    this.y = 0
    this.width = 0
    this.height = 0

    this.interpolation = Interpolator.create({ speed: 0.5, sharpness: 3, })
    this.clickRegion = ClickRegion.create()
  }
  draw({ x = 0, y = 0, width = 0, height = 0 }) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    let border = 5

    this.clickRegion.update({
      x: this.x - this.height * 0.5 - border * 0.5, y: this.y - this.height * 0.5 - border * 0.5,
      width: this.width + this.height + border, height: this.height + border,
    })

    if (this.clickRegion.check() && mouse.left) {
      this.state = !this.state
      this.onToggle(this.state)
    }

    this.interpolation.set(this.state)

    Bar.draw({
      x: this.x, y: this.y,
      width: this.width, height: this.height
    }).both(
      util.mixColors(global.colors.burple, global.colors.white, 0.8 - this.interpolation.get()),
      util.mixColors(global.colors.navyBlue, global.colors.white, 0.6 - this.interpolation.get()),
      border
    )

    Circle.draw({
      x: this.x + this.width * this.interpolation.get(), y: this.y,
      radius: this.height * 0.45,
    }).fill(global.colors.white)
  }
}

export default Toggle
