import global from '../global.js'

import {
  Element,
  RoundRect,
} from '../elements.js'

import Interpolator from './interpolation.js'
import AutoCompleteResults from './autocomplete.js'

const TagContainer = class extends Element {
  /**
   * Creates a new TagContainer.
   * @public
   * @returns {TagContainer} The current instance.
   */
  static create() {
    return new TagContainer()
  }
  constructor() {
    super()

    this.x = 0
    this.y = 0
    this.width = 0
    this.heightOffset = 0
    this.maxRowLength = 0
    this.tagSize = 0

    this.interpolation = Interpolator.create({ speed: 0.7, sharpness: 6, })

    for (let tag of global.api.activeTags) {
      tag.width = this.measureText(tag.label, tagSize).width + tagSize
    }
  }
  /**
   * Draws the tag container and the tags within onto the canvas.
   * @public
   * @param {Number} x - The x-coordinate of the tag container.
   * @param {Number} y - The y-coordinate of the tag container.
   * @param {Number} width - The width of the tag container.
   * @param {Number} heightOffset - The height offset applied to tag displays.
   * @param {Number} spacing - The spacing between each tag display.
   */
  draw({ x = 0, y = 0, width = 0, heightOffset = 0, tagSize = 0, spacing = 0, }) {
    this.x = x
    this.y = y
    this.width = width
    this.heightOffset = heightOffset
    this.maxRowLength = this.width - spacing
    this.tagSize = tagSize

    //if (global.api.activeTags.length <= 0) return
    let rows = [[]]
    let rowLength = 0
    let row = 0
    for (let tag of global.api.activeTags) {
      if (rowLength + spacing + tag.width + this.tagSize <= this.maxRowLength) {
        rows[row].push(tag)
        rowLength += spacing + tag.width + this.tagSize
      } else {
        row++
        rowLength = spacing + tag.width + this.tagSize
        rows.push([tag])
      }
    }

    this.interpolation.set(rows.length)
    RoundRect.draw({
      x, y,
      width, height: this.tagSize * this.interpolation.get() + spacing * (this.interpolation.get() + 1) + this.heightOffset,
      radii: [0, 0, 30, 30]
    }).fill(global.colors.navyBlue)

    let i = 0
    for (let row of rows) {
      let rowLength = row.filter(r => r.active).reduce((a, b) => a + b.width, 0) + (row.length - 1) * spacing
      let tagX = this.x + this.width * 0.5 - rowLength * 0.5
      let ii = 0
      for (let tag of row) {
        if (tag.interpolationX.get() < this.x)
          tag.interpolationX.forceDisplay(this.x + this.width * 0.5)
        if (tag.interpolationY.get() < this.y)
          tag.interpolationY.forceDisplay(this.y)

        if (!tag.active) {
          tag.interpolationY.set(this.y)
          if (tag.interpolationY.get() < this.y + this.heightOffset) {
            let index = global.api.activeTags.findIndex(r => r.label === tag.label)
            global.api.activeTags.splice(index, 1)
          }
        } else {
          ii++
          let targetX = tagX + tag.width * 0.5
          tag.interpolationX.set(targetX)
          tagX += tag.width + spacing

          let targetY = this.y + (this.heightOffset + spacing * (i + 1) + this.tagSize * (i + 1))
          tag.interpolationY.set(targetY)
        }

        tag.draw({
          x: tag.interpolationX.get(), y: tag.interpolationY.get(),
          size: this.tagSize,
        })
      }
      i++
    }
    return this.tagSize * this.interpolation.get() + spacing * (this.interpolation.get() + 1) + this.heightOffset
  }
}

export default TagContainer
