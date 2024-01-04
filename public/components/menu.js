import {
  Element,
  Rect
} from "../elements.js"
import global from "../global.js"
import Interpolator from "./interpolation.js"

const Menu = class extends Element {
  static create({ button = null, elementSpacing = 0 } = {}) {
    return new Menu(button, elementSpacing)
  }
  constructor(button, elementSpacing) {
    super()
    this.button = button
    this.elementSpacing = elementSpacing

    this.x = 0
    this.y = 0
    this.width = 0
    this.height = 0

    this.elements = []
    this.backgroundElement = () => {}
    this.seperatorElement = () => {}

    this.interpolator = Interpolator.create({ speed: 0.4, sharpness: 3, })
    this.interpolator.forceDisplay(1)
  }
  appendZone(element) {
    this.elements.push(element)
    return this
  }
  seperator(element) {
    this.seperatorElement = element
    return this
  }
  background(element) {
    this.backgroundElement = element
    return this
  }
  draw({ x = 0, y = 0, width = 0, height = 0, offset = 0, zoneDimensions = [] }) {
    this.x = x - width * this.interpolator.get() + offset * (1 - this.interpolator.get())
    this.y = y
    this.width = width
    this.height = height

    this.interpolator.set(this.button.state ? 0 : 1)
    this.backgroundElement(this.x, this.y, this.width, this.height)
    let nextY = 0
    for (let [i, element] of this.elements.entries()) {
      let elementWidth = width * zoneDimensions[i].width
      let elementHeight = height * zoneDimensions[i].height
      element(this.x, nextY, elementWidth, elementHeight)
      this.seperatorElement(this.x, nextY + elementHeight, this.width, this.elementSpacing)

      if (global.debug) {
        Rect.draw({
          x: this.x, y: nextY,
          width: elementWidth, height: elementHeight
        }).stroke('#ff0000', 2)
        Rect.draw({
          x: this.x, y: nextY + elementHeight,
          width: this.width, height: this.elementSpacing
        }).stroke('#ff9000', 2)
      }

      nextY += elementHeight + this.elementSpacing
    }
    return this
  }
}

export default Menu

