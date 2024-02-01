import global from '../global.js'
import Document from '../document.js'
import { mouse } from '../event.js'

import {
  Element,
  RoundRect,
  Text,
  Clip,
} from '../elements.js'
import ItemList from './itemlist.js'
import Result from './result.js'

const ResultContainer = class extends Element {
  static create() {
    return new ResultContainer()
  }
  constructor() {
    super()

    this.x = 0
    this.y = 0
    this.width = 0
    this.maxHeight = 0
    this.spacing = 10

    this.scroll = 0
    this.results = []
    this.maxRowLength = 0

    this.itemList = ItemList.create({ items: [], spacing: this.spacing })
  }
  visible(x, y, width, height) {
    return y < Document.height && y + height > 0 && x < Document.width && x + width > 0
  }
  sort() {
    this.itemList.update({
      items: global.api.results.posts.map(result => ({
        size: this.width / this.maxRowLength - (this.spacing * this.maxRowLength),
        info: result,
      })),
      spacing: this.spacing,
      maxLength: this.width,
    })
    this.refreshed = false
  }
  async draw({ x = 0, y = 0, width = 0, spacing = 5, }) {
    this.x = x
    this.y = y
    this.width = width
    this.maxRowLength = global.rowSize
    this.columns = Math.ceil(global.api.limit / this.maxRowLength)
    this.spacing = spacing
    this.boundaryWidth = this.width / this.maxRowLength - this.spacing

    this.scroll = Math.max(0, -mouse.scroll + this.scroll)//util.clamp(-mouse.scroll + this.scroll, 0, (this.boundaryWidth + this.spacing) * this.columns - (Document.height - this.y) + 30)

    Clip.rect({
      x: this.x - this.spacing, y: this.y + this.spacing,
      width: this.width + this.spacing * 2, height: Document.height - y + this.spacing * 2 - 60
    })

    if (global.api.results?.posts.length > 0) {
      if (!global.api.results.posts.every(result => this.itemList.items.map(object => object.info).includes(result))) {
        this.sort()
        if (this.results.id !== global.api.results.id)
          this.scroll = 0

        this.results = global.api.results

      }

      let iy = this.y + this.spacing
      for (let [i, row] of this.itemList.list.entries()) {
        for (let [ix, result] of row.entries()) {
          // Only draw it if it's visible for performance enhancements
          if (this.visible(
            this.x + (this.boundaryWidth + this.spacing) * ix, iy - this.scroll, this.boundaryWidth, this.boundaryWidth * (result.height / result.width)
          )) {
            Result.draw({
              result, filter: result.filteredFor,
              x: this.x + (this.boundaryWidth + this.spacing) * ix, y: iy - this.scroll,
              width: this.boundaryWidth, height: result.filteredFor.length > 0 ? 50 : this.boundaryWidth * (result.height / result.width)
            })
          }
          iy += (result.filteredFor.length > 0 ? 50 : this.boundaryWidth * (result.height / result.width)) + this.spacing
        }
      }

      if (Math.abs(this.y + this.spacing - this.scroll) > iy - this.boundaryWidth * 4 && !this.refreshed) {
        global.api.page++
        global.api.results.add(global.api.page)
        this.refreshed = true
      }
    }

    Clip.end()
  }
}

export default ResultContainer
