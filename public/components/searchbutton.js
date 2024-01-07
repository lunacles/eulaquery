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

    this.x = 0
    this.y = 0
    this.radius = 0

    this.clickRegion = ClickRegion.create()
  }
  draw({ x = 0, y = 0, radius = 0 }) {
    this.x = x
    this.y = y
    this.radius = radius

    Line.draw({
      x1: this.x + this.radius * 0.1, y1: this.y - this.radius * 0.1,
      x2: this.x - this.radius * 0.25, y2: this.y + this.radius * 0.25,
    }).stroke(global.colors.white, 3)
    Circle.draw({
      x: this.x + this.radius * 0.1, y: this.y - this.radius * 0.1,
      radius: this.radius * 0.15,
    }).both(global.colors.burple, global.colors.white, 5)

    this.clickRegion.update({
      x: this.x - this.radius * 0.5, y: this.y - this.radius * 0.5,
      width: this.radius, height: this.radius,
    })

    if (this.clickRegion.check() && mouse.left)
      global.api.results = Page.get({ page: global.api.page, tags: global.api.activeTags })
  }
}

export default SearchButton
