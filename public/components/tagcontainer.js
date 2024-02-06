import global from '../global.js'
import Color from '../color.js'

import {
  Element,
  RoundRect,
} from '../elements.js'

import Interpolator from './interpolation.js'
import ItemList from './itemlist.js'
import Storage from '../localstorage.js'

const TagContainer = class extends Element {
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
    this.spacing = 0

    this.itemList = ItemList.create({ items: global.api.activeTags, spacing: this.spacing })

    this.interpolation = Interpolator.create({ speed: 0.5, sharpness: 4, })
  }
  sort() {
    this.itemList.update({
      items: global.api.activeTags.map(tag => ({
        size: tag.width + this.tagSize,
        info: tag,
      })),
      spacing: this.spacing,
      maxLength: this.maxRowLength
    })
  }
  place() {
    let i = 0
    for (let row of this.itemList.list) {
      let rowLength = row.filter(r => r.active).reduce((a, b) => a + b.width, 0) + (row.length - 1) * this.spacing
      let tagX = this.x + this.width * 0.5 - rowLength * 0.5
      let ii = 0
      for (let tag of row) {
        if (tag.interpolationX.get() < this.x)
          tag.interpolationX.forceDisplay(tagX)
        if (tag.interpolationY.get() < this.y)
          tag.interpolationY.forceDisplay(this.y)

        if (!tag.active) {
          tag.interpolationY.set(this.y)
          if (tag.interpolationY.get() < this.y + this.heightOffset) {
            let index = global.api.activeTags.findIndex(r => r.label === tag.label)
            global.api.activeTags.splice(index, 1)
            Storage.tags.set({
              value: global.options.saveTags ? global.api.activeTags.map(tag => tag.label) : []
            })
          }
        } else {
          ii++
          let targetX = tagX + tag.width * 0.5
          tag.interpolationX.set(targetX)
          tagX += tag.width + this.spacing

          let targetY = this.y + (this.heightOffset + this.spacing * (i + 1) + this.tagSize * (i + 1))
          tag.interpolationY.set(targetY)
        }

        tag.draw({
          x: tag.interpolationX.get(), y: tag.interpolationY.get(),
          size: this.tagSize,
        })
      }
      i++
    }
  }
  draw({ x = 0, y = 0, width = 0, heightOffset = 0, tagSize = 0, spacing = 0, }) {
    this.x = x
    this.y = y
    this.width = width
    this.heightOffset = heightOffset
    this.maxRowLength = this.width - spacing
    this.tagSize = tagSize
    this.spacing = spacing

    this.sort()

    this.interpolation.set(this.itemList.list.length)
    this.height = this.tagSize * this.interpolation.get() + spacing * (this.interpolation.get() + 1) + this.heightOffset * Math.min(1, this.interpolation.get())
    RoundRect.draw({
      x, y,
      width, height: this.height,
      radii: [0, 0, 2, 2]
    }).fill(Color.navyBlue)

    this.place()
  }
}

export default TagContainer
