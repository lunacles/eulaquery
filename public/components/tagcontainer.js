import global from '../global.js'

import {
  Element,
  RoundRect,
} from '../elements.js'

import Interpolator from './interpolation.js'

const TagContainer = class extends Element {
  /**
   * Creates a new TagContainer.
   * @public
   * @param {Number} tagSize - The size of the tag displays.
   * @returns {TagContainer} The current instance.
   */
  static create(tagSize) {
    return new TagContainer(tagSize)
  }
  constructor(tagSize) {
    super()

    this.x = 0
    this.y = 0
    this.width = 0
    this.heightOffset = 0
    this.maxRowLength = 0
    this.tagSize = tagSize

    this.interpolator = Interpolator.create({ speed: 0.4, sharpness: 6, })

    for (let tag of global.api.activeTags)
      tag.width = this.measureText(tag.label, tagSize).width + tagSize
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
  draw({ x = 0, y = 0, width = 0, heightOffset = 0, spacing = 0, }) {
    this.x = x
    this.y = y
    this.width = width
    this.heightOffset = heightOffset
    this.maxRowLength = width * 0.8 - spacing

    //if (global.api.activeTags.length <= 0) return
    let rows = [[]]
    let rowLength = 0
    let row = 0
    for (let tag of global.api.activeTags) {
      if (rowLength + spacing + tag.width + this.tagSize <= this.maxRowLength) {
        rowLength += spacing + tag.width + this.tagSize
        rows[row].push(tag)
      } else {
        row++
        rowLength = 0
        rows.push([tag])
      }
    }

    this.interpolator.set(rows.length)
    RoundRect.draw({
      x, y,
      width, height: this.tagSize * this.interpolator.get() + spacing * (this.interpolator.get() + 1) + this.heightOffset,
      radii: [0, 0, 30, 30]
    }).fill(global.colors.navyBlue)

    for (let [i, row] of rows.entries()) {
      let rowLength = row.reduce((a, b) => a + b.width, 0) + (row.length - 1) * spacing
      let tagX = this.x + this.width * 0.5 - rowLength * 0.5
      for (let [ii, tag] of row.entries()) {
        tag.draw({
          x: tagX + tag.width * 0.5 + spacing * Math.min(0, ii), y: y + this.heightOffset + spacing * (i + 1) + this.tagSize * (i + 1),
          size: this.tagSize,
        })
        tagX += tag.width + spacing

      }
    }
  }
}

export default TagContainer
