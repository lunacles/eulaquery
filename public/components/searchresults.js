import global from '../global.js'
import Document from '../document.js'

import {
  Element,
  RoundRect,
  Text,
  Clip,
  Rect,
  Poly,
} from '../elements.js'
import ClickRegion from './clickregion.js'
import ItemList from './itemlist.js'

import { Filters } from '../filter.js'
import { mouse } from '../event.js'
import * as util from '../util.js'

const Result = class extends Element {
  static draw({ result = {}, filter = [], x = 0, y = 0, width = 0, height = 0 }) {
    return new Result(result, filter, x, y, width, height)
  }
  constructor(result, filter, x, y, width, height) {
    super()

    this.result = result
    this.filter = filter
    this.selected = false
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.spacing = 10
    this.border = 5

    this.draw()
  }
  drawFileType(type) {
    let size = 20
    RoundRect.draw({
      x: this.x + this.spacing * 2 - size * 0.5, y: this.y + this.spacing * 2 - size * 0.5,
      width: this.measureText(type.toUpperCase(), size).width + size, height: size * 2,
      radii: [5, 5, 5, 5]
    }).alpha(0.75).fill(global.colors.black)
    Text.draw({
      x: this.x + this.spacing * 2, y: this.y + this.spacing * 2 + size * 0.75,
      size: size,
      text: type.toUpperCase(),
      align: 'left',
    }).fill(global.colors.white)
  }
  draw() {
    Clip.rect({
      x: this.x, y: this.y,
      width: this.width, height: this.height
    })

    if (this.filter.length > 0) {
      RoundRect.draw({
        x: this.x, y: this.y,
        width: this.width, height: this.height,
        radii: [10, 10, 10, 10]
      }).fill(global.colors.navyBlue)
      Text.draw({
        x: this.x + this.width * 0.5, y: this.y + 5 + this.height / 3,
        align: 'center',
        size: this.height / 3,
        text: `Filtered For: ${this.filter.join(', ')}`
      }).fill(global.colors.white)
      Text.draw({
        x: this.x + this.width * 0.5, y: this.y + 10 + this.height / 1.5,
        align: 'center',
        size: this.height / 3,
        text: 'Click here to view'
      }).fill(global.colors.white)

    //if (this.result.thumbnail.loaded && !this.selected) {
    } else if (this.result.file.src.loaded && !this.selected) {
      //this.result.thumbnail.draw({
      //  x: this.x + this.border * 0.5, y: this.y + this.border * 0.5,
      //  width: this.width - this.border, height: this.height - this.border,
      //})
      this.result.file.src.draw({
        x: this.x + this.border * 0.5, y: this.y + this.border * 0.5,
        width: this.width - this.border, height: this.height - this.border,
      })
      this.drawFileType(this.result.file.src.type)
    } else {
      RoundRect.draw({
        x: this.x, y: this.y,
        width: this.width, height: this.height,
        radii: [10, 10, 10, 10]
      }).fill(global.colors.navyBlue)
    }
    RoundRect.draw({
      x: this.x, y: this.y,
      width: this.width, height: this.height,
      radii: [15, 15, 15, 15]
    }).stroke(global.colors.navyBlue, 10)

    Clip.end()

    return this
  }
}

const SearchResults = class extends Element {
  static create() {
    return new SearchResults()
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
  async draw({ x = 0, y = 0, width = 0, spacing = 5, maxRowLength = 0 }) {
    this.x = x
    this.y = y
    this.width = width
    this.maxRowLength = maxRowLength
    this.columns = Math.ceil(global.api.limit / this.maxRowLength)
    this.spacing = spacing
    this.boundaryWidth = this.width / this.maxRowLength - this.spacing * 1.5

    this.scroll = Math.max(0, -mouse.scroll + this.scroll)//util.clamp(-mouse.scroll + this.scroll, 0, (this.boundaryWidth + this.spacing) * this.columns - (Document.height - this.y) + 30)

    Clip.rect({
      x: this.x - this.spacing, y: this.y + this.spacing,
      width: this.width + this.spacing * 2, height: Document.height - y + this.spacing * 2 - 60
    })

    if (global.api.results && global.api.results.posts.length > 0) {
      if (!global.api.results.posts.every(result => this.itemList.items.map(object => object.info).includes(result))) {
        this.sort()
        if (this.results.id !== global.api.results.id)
          this.scroll = 0

        this.results = global.api.results

      }

      let iy = this.y + this.spacing
      for (let [i, row] of this.itemList.list.entries()) {
        for (let [ix, result] of row.entries()) {
          let filteredFor = []
          for (let [type, _] of Object.entries(global.filter).filter(([_, state]) => state)) {
            let filtered = Filters[type].check(result.data.tagInfo.map(data => data.tag))
            if (filtered)
              filteredFor.push(type)
          }

          if (this.visible(
            this.x + this.spacing + (this.boundaryWidth + this.spacing) * ix, iy - this.scroll, this.boundaryWidth, this.boundaryWidth * (result.height / result.width)
          )) {
            Result.draw({
              result, filter: filteredFor,
              x: this.x + this.spacing + (this.boundaryWidth + this.spacing) * ix, y: iy - this.scroll,
              width: this.boundaryWidth, height: filteredFor.length > 0 ? 50 : this.boundaryWidth * (result.height / result.width)
            }).height
          }
          iy += (filteredFor.length > 0 ? 50 : this.boundaryWidth * (result.height / result.width)) + this.spacing
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

export default SearchResults
