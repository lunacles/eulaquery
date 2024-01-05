import {
    Element,
    RoundRect,
} from '../elements.js'
import Interpolator from './interpolation.js'
import ClickRegion from './clickregion.js'

import global from '../global.js'
import { mouse } from '../event.js'
import * as util from '../util.js'

const CheckBox = class extends Element {
  static create(defaultState, onCheck = () => {}) {
    return new CheckBox(defaultState, onCheck)
  }
  constructor(defaultState, onCheck) {
    super()

    this.state = defaultState
    this.onCheck = onCheck
    this.x = 0
    this.y = 0
    this.width = 0
    this.height = 0

    this.interpolation = Interpolator.create({ speed: 0.2, sharpness: 3, })
    this.clickRegion = ClickRegion.create()
  }
  draw({ x = 0, y = 0, width = 0, height = 0 }) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    let border = 5

    this.clickRegion.update({
      x: this.x - border * 0.5, y: this.y - border * 0.5,
      width: this.width + border, height: this.height + border,
    })

    if (this.clickRegion.check() && mouse.left) {
      this.state = !this.state
      this.onCheck(this.state)
    }

    this.interpolation.set(this.state)

    RoundRect.draw({
      x: this.x, y: this.y,
      width: this.width, height: this.height,
      radii: [2, 2, 2, 2]
    }).both(
      util.mixColors(global.colors.burple, global.colors.white, -0.2),
      util.mixColors(global.colors.navyBlue, global.colors.white, -0.4),
      border
    )

    RoundRect.draw({
      x: this.x + this.width * 0.1, y: this.y + this.height * 0.1,
      width: this.width * 0.8, height: this.height * 0.8,
      radii: [2, 2, 2, 2]
    }).alpha(this.interpolation.get()).fill(global.colors.white)
  }
}

export default CheckBox
