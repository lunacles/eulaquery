import global from '../global.js'

import {
  Element,
  Line,
} from '../elements.js'

import Interpolator from './interpolation.js'
import ClickRegion from './clickregion.js'

import { mouse } from '../event.js'

const MenuButton = class extends Element {
  static create(hook) {
    return new MenuButton(hook)
  }
  constructor(hook) {
    super()

    this.hook = hook
    this.state = false

    this.x = 0
    this.y = 0
    this.width = 0
    this.height = 0

    this.clickRegion = ClickRegion.create()
    this.interpolator = Interpolator.create({ speed: 0.3, sharpness: 3 })
  }
  hamburger() {
    let state = this.interpolator.get()
    let centerX = this.x + this.width * 0.5
    let shrinkX = this.width * 0.5 * (1 - state)

    let centerY = this.y + this.height * 0.5
    let shrinkY = this.height * 0.5 * state

    let y1 = this.y + shrinkY
    let y2 = this.y + this.height - shrinkY

    Line.draw({
        x1: centerX - shrinkX, y1: y1,
        x2: centerX + shrinkX, y2: y1
    }).stroke(global.colors.white, this.height / 4)

    Line.draw({
        x1: centerX - shrinkX, y1: y2,
        x2: centerX + shrinkX, y2: y2
    }).stroke(global.colors.white, this.height / 4)

    Line.draw({
        x1: this.x, y1: centerY - shrinkY,
        x2: this.x + this.width, y2: centerY + shrinkY
    }).stroke(global.colors.white, this.height / 4)

    Line.draw({
        x1: this.x + this.width, y1: centerY - shrinkY,
        x2: this.x, y2: centerY + shrinkY
    }).stroke(global.colors.white, this.height / 4)

  }
  draw({ x = 0, y = 0, width = 0, height = 0 }) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height

    this.interpolator.set(this.state ? 1 : 0)
    this.clickRegion.update({
      x: this.x - this.width * 0.5, y: this.y - this.width * 0.5,
      width: this.width * 2, height: this.height * 2,
    })

    if (this.clickRegion.check() && mouse.left) {
      console.log(this.state)
      this.state = !this.state
    }

    this.hamburger()
  }
}

export default MenuButton
