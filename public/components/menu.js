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
  draw({ x = 0, y = 0, width = 0, height = 0, zoneDimensions = [] }) {
    this.interpolator.set(this.button.state ? 0 : 1)
    x -= (width + 50) * this.interpolator.get()
    this.backgroundElement(x, y, width, height)
    let nextY = 0
    for (let [i, element] of this.elements.entries()) {
      let elementWidth = width * zoneDimensions[i].width
      let elementHeight = height * zoneDimensions[i].height
      element(x, nextY, elementWidth, elementHeight)
      this.seperatorElement(x, nextY + elementHeight, width, this.elementSpacing)

      if (global.debug) {
        Rect.draw({
          x, y: nextY,
          width: elementWidth, height: elementHeight
        }).stroke('#ff0000', 2)
        Rect.draw({
          x, y: nextY + elementHeight,
          width: width, height: this.elementSpacing
        }).stroke('#ff9000', 2)
      }

      nextY += elementHeight + this.elementSpacing
    }
    return this
  }
}

export default Menu

