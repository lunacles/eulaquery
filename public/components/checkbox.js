import {
  Element,
  RoundRect,
} from '../elements.js'
import Interpolator from './interpolation.js'
import Button from './button.js'

import * as util from '../util.js'

const CheckBox = class extends Element {
  static create({
    defaultState = false, 
    onCheck = () => {},
    checkColor = '#ffffff',
    backgroundColor = '#000000',
  }) {
    return new CheckBox(defaultState, onCheck, checkColor, backgroundColor)
  }
  constructor(defaultState, onCheck, checkColor, backgroundColor) {
    super()
  
    this.checkColor = checkColor
    this.backgroundColor = backgroundColor

    this.x = 0
    this.y = 0
    this.width = 0
    this.height = 0

    this.interpolation = Interpolator.create({ speed: 0.2, sharpness: 3, })

    this.button = Button.create({
      defaultState,
      onUpdate: onCheck,
    })
  }
  draw({ x = 0, y = 0, width = 0, height = 0 }) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    let border = 5

    this.button.update({
      x: this.x, y: this.y,
      width: this.width, height: this.height,
    })

    this.interpolation.set(this.button.state)

    RoundRect.draw({
      x: this.x, y: this.y,
      width: this.width, height: this.height,
      radii: [2, 2, 2, 2]
    }).both(
      this.backgroundColor,
      util.mixColors(this.backgroundColor, '#000000', 0.3),
      border
    )

    RoundRect.draw({
      x: this.x + this.width * 0.1, y: this.y + this.height * 0.1,
      width: this.width * 0.8, height: this.height * 0.8,
      radii: [2, 2, 2, 2]
    }).alpha(this.interpolation.get()).fill(this.checkColor)
  }
}

export default CheckBox
