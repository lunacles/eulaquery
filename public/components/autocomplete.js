import global from '../global.js'
import {
  Element,
  Text,
  Bar,
} from '../elements.js'
import Interpolator from './interpolation.js'
import ClickRegion from './clickregion.js'
import Tag from './tag.js'

import { autoComplete } from '../../src/api/autocomplete.js'
import { mouse } from '../event.js'

const AutoCompleteResults = class extends Element {
  static create({ hook = null }) {
    if (!hook) throw Error('Invalid text hook!')
    return new AutoCompleteResults(hook)
  }
  constructor(textHook) {
    super()
    if (!textHook || textHook.text == null || typeof textHook.text !== 'string') throw Error('Invalid text hook!')
    this.hook = textHook

    this.cachedText = ''
    this.lastInputTime = Date.now()
    this.results = []
    this.pendingRefresh = false

    this.interpolation = Interpolator.createGroup({ size: 10, speed: 0.2, sharpness: 3 })
    this.clickRegions = Array(10).fill(ClickRegion.create())

    this.tick = 0
  }
  async refreshResults() {
    let text = this.hook.text
    this.results = await autoComplete(text.length > 0 ? text.replace(' ', '_') : ' ')
    this.pendingRefresh = false
    console.log('Refreshed query')
  }
  async draw({ x = 0, y = 0, width = 0, height = 0 } = {}) {
    this.tick++
    this.textSize = height * 0.5

    if (this.cachedText !== this.hook.text) {
      this.lastInputTime = this.tick
      this.cachedText = this.hook.text
      this.pendingRefresh = true
    }
    if (this.pendingRefresh && this.tick - this.lastInputTime > 60) {
      this.lastInputTime = this.tick
      for (let interpolation of this.interpolation) {
        interpolation.set(0)
        interpolation.freeze(300)
      }

      this.refreshResults()
    }

    let spacing = 5
    global.clickOverride = false
    for (let i = 0; i < 10; i++) {
      let result = this.results[i]
      let interpolation = this.interpolation[i]
      if (!this.pendingRefresh)
        interpolation.set(1)

      this.clickRegions[i].toggle(result)
      if (result) {
        global.clickOverride = true
        let iy = (height * i + spacing * i) * interpolation.get() + (height + spacing * 2) * interpolation.get()

        Bar.draw({
          x, y: y + iy,
          width, height
        }).fill(global.colors.darkGray)

        let [ label, amount ] = result.label.split(/\s(?=\()/)
        Text.draw({
          x, y: y + iy + 3,
          size: height * 0.5,
          text: label.length <= 60 ? label : label.slice(0, 60) + "...",
          align: 'left',
        }).fill(global.colors.white)
        Text.draw({
          x: x + width, y: y + iy + 3,
          size: height * 0.5,
          text: amount,
          align: 'right',
        }).fill(global.colors.white)

        this.clickRegions[i].update({
          x: x - height * 0.5, y: y + iy - height * 0.5,
          width: width + height, height,
        })
        if (this.clickRegions[i].check() && mouse.left) {
          this.hook.text = ''
          this.cachedText = this.hook.text
          this.pendingRefresh = true
          if (!global.api.activeTags.find(tag => tag.label === label))
            global.api.activeTags.push(Tag.create({ label, type: '' }))
        }
      }
    }
  }
}

export default AutoCompleteResults
