import global from '../global.js'
import {
  Element,
  Bar,
} from '../elements.js'
import Interpolator from './interpolation.js'
import ClickRegion from './clickregion.js'
import Color from '../color.js'

import Interaction from '../interaction.js'
import { Page } from '../../src/api/post.js'
import TextObjects from '../textobjects.js'
import TextObj from './text.js'

const Tag = class extends Element {
  static create({ label = '', type = '' }) {
    return new Tag(label, type)
  }
  constructor(label, type) {
    super()
    this.label = label
    this.type = type

    this.width = 0
    this.active = true

    this.clickRegion = ClickRegion.create()
    this.interpolationX = Interpolator.create({ speed: 0.4, sharpness: 6 })
    this.interpolationY = Interpolator.create({ speed: 0.6, sharpness: 6 })

    TextObjects.tags.set(label, TextObj.create())
  }
  draw({ x = 0, y = 0, size = 0 }) {
    let label = this.label.length <= 30 ? this.label : this.label.slice(0, 30) + '...'
    let width = this.measureText(label, size).width
    this.width = width + size
    Bar.draw({
      x: x - width * 0.5, y: y - size,
      width, height: size,
    }).fill(Color.burple)
    TextObjects.tags.get(this.label).draw({
      x, y: y - size * 0.25,
      size: size * 0.8,
      text: label,
      align: 'center',
    }).fill(Color.white)

    this.clickRegion.update({
      x: x - width * 0.5, y: y - size,
      width: width, height: size,
    })

    if (this.clickRegion.check() && Interaction.mouse.left && !global.clickOverride.tags) {
      this.active = false
      global.api.results = Page.get({ page: global.api.page, tags: global.api.activeTags })
      // Really scuffed bug fix
      Interaction.mouse.left = false
    }
  }
}

export default Tag
