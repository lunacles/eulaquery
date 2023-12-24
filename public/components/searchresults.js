import global from '../global.js'
import Document from '../document.js'

import {
  Element,
  RoundRect,
  Clip,
  Rect,
} from '../elements.js'
import ClickRegion from './clickregion.js'

import { mouse } from '../utilities/event.js'
import { Page } from '../../src/api/post.js'

const SearchResults = class extends Element {
  static create() {
    return new SearchResults()
  }
  constructor() {
    super()

    this.spacing = 10
  }
  get height() {
    for (let result of global.api.results) {
      let ratio = result.height / this.width

    }
    return global.api.results
  }
  getPostHeight(height) {
    let ratio = this.width / height
    return height * ratio
  }
  get scroll() {
    return mouse.scroll * 100
  }
  draw({ x = 0, y = 0, width = 0, }) {
    this.x = x
    this.y = y
    this.width = width

    let clip = Clip.start({
      x: this.x - this.spacing, y: this.y - this.spacing,
      width: this.width + this.spacing * 2, height: Document.height - y + this.spacing * 2
    })

    let iy = 0
    if (global.api.results && Array.isArray(global.api.results.posts)) {
      for (let result of global.api.results.posts) {
        let height = this.getPostHeight(result.height)

        RoundRect.draw({
          x: this.x, y: iy + this.y + this.scroll,
          width: this.width, height,
          radii: [30, 30, 30, 30]
        }).fill(global.colors.navyBlue)

        if (result.media.loaded) {
          result.media.draw({
            x: this.x + this.spacing * 0.5, y: iy + this.y + this.spacing * 0.5 + this.scroll,
            width: this.width - this.spacing , height: height - this.spacing ,
          })
          RoundRect.draw({
            x: this.x, y: iy + this.y + this.scroll,
            width: this.width, height,
            radii: [30, 30, 30, 30]
          }).stroke(global.colors.navyBlue, 10)
        }
        iy += height + this.spacing * 1.5
      }
    }
    Clip.end(clip)
  }
}

export default SearchResults
