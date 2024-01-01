import global from '../global.js'

import {
  Element,
  Line,
  Circle,
} from '../elements.js'
import ClickRegion from './clickregion.js'

import Document from '../document.js'
import { mouse } from '../event.js'
import { Page } from '../../src/api/post.js'

const SearchButton = class extends Element {
  static create({ hook = null }) {
    if (!hook) throw Error('Invalid text hook!')
    return new SearchButton(hook)
  }
  constructor(textHook) {
    super()

    this.hook = textHook

    this.clickRegion = ClickRegion.create()
  }
  draw({ x = 0, y = 0, radius = 0, offset = 0 }) {
    let lineWidth = 8
    Circle.draw({
      x: x + offset * 0.5, y: y - offset * 0.5,
      radius: radius * 0.5,
    }).fill(global.colors.navyBlue)
    Line.draw({
      x1: x + radius * 0.2, y1: y - radius * 0.2,
      x2: x - radius * 0.15, y2: y + radius * 0.15,
    }).stroke(global.colors.white, lineWidth * 0.5)
    Circle.draw({
      x: x + radius * 0.2, y: y - radius * 0.2,
      radius: radius * 0.15,
    }).both(global.colors.navyBlue, global.colors.white, lineWidth)

    this.clickRegion.update({
      x: x + offset * 0.5 - radius * 0.5, y: y - offset * 0.5 - radius * 0.5,
      width: radius, height: radius
    })

    if (this.clickRegion.check() && mouse.left) {
      global.api.results = Page.get({ page: global.api.page, tags: global.api.activeTags })
      mouse.scroll = 0
    }
  }
}

export default SearchButton
