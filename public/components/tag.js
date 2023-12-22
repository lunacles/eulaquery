import global from '../global.js'
import {
  Element,
  Text,
  Rect,
} from '../elements.js'
import Bar from './bar.js'
import Interpolator from './interpolation.js'
import ClickRegion from './clickregion.js'

import { mouse } from '../utilities/event.js'

const Tag = class extends Element {
  /**
   * Creates a new Tag instance.
   * @public
   * @param {String} label - The label of the tag.
   * @param {String} type - The type of the tag.
   * @returns {Tag} The current instance.
   */
  static create({ label = '', type = '' }) {
    return new Tag(label, type)
  }
  constructor(label, type) {
    super()
    this.label = label
    this.type = type

    this.width = 0

    this.clickRegion = ClickRegion.create()
    this.interpolation = Interpolator.create({ speed: 2, sharpness: 6 })
  }
 /**
   * Draws the tag display onto the canvas and checks for clicks.
   * @public
   * @param {Number} x - The x-coordinate of the tag display.
   * @param {Number} y - The y-coordinate of the tag display.
   * @param {Number} size - The size of the tag display.
   */
  draw({ x = 0, y = 0, size = 0 }) {
    let label = this.label.length <= 30 ? this.label : this.label.slice(0, 30) + "..."
    let width = this.measureText(label, size).width
    this.width = width + size
    Bar.draw({
      x: x - width * 0.5, y: y - size * 0.5,
      width, height: size,
    }).fill(global.colors.emperor)
    Text.draw({
      x, y: y - size * 0.25,
      size: size * 0.8,
      text: label,
      align: 'center',
    }).fill(global.colors.white)

    this.clickRegion.update({
      x: x - width * 0.5 - size * 0.5, y: y - size,
      width: width + size, height: size
    })

    if (this.clickRegion.check() && mouse.left) {
      let index = global.api.activeTags.indexOf(this.label)
      global.api.activeTags.splice(index, 1)
    }
  }
}

export default Tag
