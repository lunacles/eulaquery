import global from '../global.js'
import Document from '../document.js'

import {
  Element,
  RoundRect,
  Clip,
} from '../elements.js'
import ClickRegion from './clickregion.js'

import { mouse } from '../utilities/event.js'
import * as util from '../utilities/util.js'

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
  }
  update() {
    this.results = []
    this.maxHeight = 0
    for (let result of global.api.results.posts) {
      let height = this.getPostHeight(result.height)
      this.results.push({
        height,
        iy: this.maxHeight + this.y,
        result,
      })

      this.maxHeight += height + this.spacing * 1.5
    }
  }
  getPostHeight(height) {
    let ratio = this.width / height
    return height * ratio
  }
  visible(x, y, width, height) {
    return y < Document.height && y + height > 0 && x < Document.width && x + width > 0
  }
  draw({ x = 0, y = 0, width = 0, }) {
    this.x = x
    this.y = y
    this.width = width
    this.scroll = util.clamp(-mouse.scroll + this.scroll, 0, this.maxHeight - (Document.height - this.y))

    let clip = Clip.start({
      x: this.x - this.spacing, y: this.y - this.spacing,
      width: this.width + this.spacing * 2, height: Document.height - y + this.spacing * 2
    })

    if (global.api.results && Array.isArray(global.api.results.posts)) {
      if (!global.api.results.posts.every(result => this.results.map(object => object.result).includes(result)))
        this.update()

      for (let { result, iy, height } of this.results) {
        if (this.visible(this.x + this.spacing * 0.5, iy + this.spacing * 0.5 - this.scroll, this.width - this.spacing, height - this.spacing)) {
          Result.draw({
            result,
            x: this.x, y: iy - this.scroll,
            width: this.width, height
          })
        }
      }
    }
    Clip.end(clip)
  }
}

const Result = class extends Element {
  static draw({ result = {}, x = 0, y = 0, width = 0, height = 0 }) {
    return new Result(result, x, y, width, height)
  }
  constructor(result, x, y, width, height) {
    super()

    this.result = result
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.spacing = 10

    this.draw()
  }
  draw() {
    if (this.result.media.loaded) {
      this.result.media.draw({
        x: this.x + this.spacing * 0.5, y: this.y + this.spacing * 0.5,
        width: this.width - this.spacing, height: this.height - this.spacing,
      })
      RoundRect.draw({
        x: this.x, y: this.y,
        width: this.width, height: this.height,
        radii: [30, 30, 30, 30]
      }).stroke(global.colors.navyBlue, 10)
    } else {
      RoundRect.draw({
        x: this.x, y: this.y,
        width: this.width, height: this.height,
        radii: [30, 30, 30, 30]
      }).fill(global.colors.navyBlue)
    }
  }
}

export default SearchResults
