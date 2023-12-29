import global from '../global.js'
import Document from '../document.js'

import {
  Element,
  RoundRect,
  Text,
  Clip,
  Poly,
} from '../elements.js'
import ClickRegion from './clickregion.js'
import ItemList from './itemlist.js'

import { mouse } from '../event.js'
import * as util from '../util.js'

const Result = class extends Element {
  static draw({ result = {}, x = 0, y = 0, width = 0, height = 0 }) {
    return new Result(result, x, y, width, height)
  }
  constructor(result, x, y, width, height) {
    super()

    this.result = result
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
    if (this.result.thumbnail.loaded && !this.selected) {
      this.result.thumbnail.draw({
        x: this.x + this.border * 0.5, y: this.y + this.border * 0.5,
        width: this.width - this.border, height: this.height - this.border,
      })
      this.drawFileType(this.result.file.src.type)
      /*if (this.result.file.src.type === 'video') {
        Poly.draw({
          x: this.x + this.width * 0.5 - 50, y: this.y + this.height * 0.5 - 50,
          width: 100, height: 100,
          path: [
            [7.5, 0],
            [-2.5, 5],
            [-2.5, -5],
          ]
        }).alpha(0.75).fill(global.colors.white)
      }*/
      RoundRect.draw({
        x: this.x, y: this.y,
        width: this.width, height: this.height,
        radii: [10, 10, 10, 10]
      }).stroke(global.colors.navyBlue, this.border)
    } else {
      RoundRect.draw({
        x: this.x, y: this.y,
        width: this.width, height: this.height,
        radii: [10, 10, 10, 10]
      }).fill(global.colors.navyBlue)
    }
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
  }
  draw({ x = 0, y = 0, width = 0, spacing = 5, maxRowLength = 0 }) {
    this.x = x
    this.y = y
    this.width = width
    this.maxRowLength = maxRowLength
    this.columns = Math.ceil(global.api.limit / this.maxRowLength)
    this.spacing = spacing
    this.boundaryWidth = this.width / this.maxRowLength - this.spacing * 2
    this.boundaryHeight = (Document.height - this.y) / this.columns - this.spacing * 2

    this.scroll = util.clamp(-mouse.scroll + this.scroll, 0, this.maxHeight - (Document.height - this.y))

    let clip = Clip.start({
      x: this.x - this.spacing, y: this.y - this.spacing,
      width: this.width + this.spacing * 2, height: Document.height - y + this.spacing * 2
    })

    if (global.api.results && Array.isArray(global.api.results.posts)) {
      if (!global.api.results.posts.every(result => this.itemList.items.map(object => object.info).includes(result))) {
        console.log(global.api.results.posts, this.itemList.items.map(object => object.info))
        this.sort()
      }

      for (let [iy, row] of this.itemList.list.entries()) {
        for (let [ix, result] of row.entries()) {
          //if (this.visible(this.x + this.spacing * 0.5, iy + this.spacing * 0.5 - this.scroll, this.width - this.spacing, height - this.spacing))
            let resultRatio = result.width / result.height
            let resultWidth = 0
            let resultHeight = 0
            if (resultRatio > this.boundaryWidth / this.boundaryHeight) {
              resultWidth = this.boundaryWidth
              resultHeight = resultWidth / resultRatio
            } else {
              resultHeight = this.boundaryHeight
              resultWidth = resultHeight * resultRatio
            }
            Result.draw({
              result,
              x: this.x + this.spacing + (this.boundaryWidth + this.spacing) * ix + (this.boundaryWidth - resultWidth) * 0.5, y: this.y + this.spacing + (this.boundaryHeight + this.spacing) * iy + (this.boundaryHeight - resultHeight) * 0.5,
              width: resultWidth, height: resultHeight
            })
          //}
        }
      }
    }

    Clip.end(clip)
  }
}

export default SearchResults
