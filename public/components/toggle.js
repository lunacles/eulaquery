import {
  Element,
  Bar,
  Circle
} from '../elements.js'
import Interpolator from './interpolation.js'
import Button from './button.js'

import * as util from '../util.js'

const Toggle = class extends Element {
  static create({
    defaultState = false, 
    onToggle = () => {},
    sliderColor = '#ffffff',
    activeColor = '#000000',
    inactiveColor = '#696969',
  }) {
    return new Toggle(defaultState, onToggle, sliderColor, activeColor, inactiveColor)
  }
  constructor(defaultState, onToggle, sliderColor, activeColor, inactiveColor) {
    super()

    this.sliderColor = sliderColor
    this.activeColor = activeColor
    this.inactiveColor = inactiveColor
    
    this.x = 0
    this.y = 0
    this.width = 0
    this.height = 0
    this.border = 0

    this.interpolation = Interpolator.create({ speed: 0.5, sharpness: 3, })

    this.button = Button.create({
      defaultState,
      onUpdate: onToggle,
    })
  }
  draw({ x = 0, y = 0, width = 0, height = 0, border = 5 }) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.border = border

    this.button.update({
      x: this.x, y: this.y,
      width: this.width, height: this.height,
    })

    this.interpolation.set(this.button.state)

    Bar.draw({
      x: this.x, y: this.y,
      width: this.width, height: this.height
    }).both(
      util.mixColors(this.activeColor, this.inactiveColor, 0.8 - this.interpolation.get()),
      util.mixColors(util.mixColors(this.activeColor, '#000000', 0.3), this.inactiveColor, 0.6 - this.interpolation.get()),
      border
    )

    Circle.draw({
      x: this.x + this.border + (this.width - this.height) * this.interpolation.get(), y: this.y + this.border,
      radius: this.height * 0.5 - this.border,
    }).fill(this.sliderColor)
  }
}

export default Toggle