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
import Storage from '../localstorage.js'

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
    this.bottomY = 0
  }
  async refreshResults() {
    let text = this.hook.text
    this.results = await autoComplete(text.length > 0 ? text.replace(' ', '_') : ' ')
    this.pendingRefresh = false
    console.log('Refreshed query')
  }
  async draw({ x = 0, y = 0, width = 0, height = 0 } = {}) {
    this.tick++
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.textSize = this.height * 0.5

    if (this.cachedText !== this.hook.text) {
      this.lastInputTime = this.tick
      this.cachedText = this.hook.text
      this.pendingRefresh = true
    }
    if (this.pendingRefresh && this.tick - this.lastInputTime > 20) {
      this.lastInputTime = this.tick
      for (let interpolation of this.interpolation)
        interpolation.set(0)

      this.refreshResults()
    }

    let spacing = 5
    for (let i = 0; i < 10; i++) {
      let result = this.results[i]
      let interpolation = this.interpolation[i]
      if (!this.pendingRefresh)
        interpolation.set(1)

      this.clickRegions[i].toggle(result)
      if (result) {
        this.bottomY = (this.height * i + spacing * i) * interpolation.get() + (this.height + spacing * 2) * interpolation.get()

        Bar.draw({
          x, y: this.y + this.bottomY,
          width: this.width, height: this.height
        }).fill(global.colors.darkGray)

        let [ label, amount ] = result.label.split(/\s(?=\()/)
        Text.draw({
          x, y: this.y + this.bottomY + 3,
          size: this.height * 0.5,
          text: label.length <= 60 ? label : label.slice(0, 60) + '...',
          align: 'left',
        }).fill(global.colors.white)
        Text.draw({
          x: this.x + this.width, y: this.y + this.bottomY + 3,
          size: this.height * 0.5,
          text: amount,
          align: 'right',
        }).fill(global.colors.white)

        this.clickRegions[i].update({
          x: this.x - this.height * 0.5, y: this.y + this.bottomY - this.height * 0.5,
          width: this.width + this.height, height: this.height,
        })
        if (this.clickRegions[i].check() && mouse.left && !global.clickOverride.tags) {
          this.hook.text = ''
          this.cachedText = this.hook.text
          this.pendingRefresh = true
          if (!global.api.activeTags.find(tag => tag.label === label)) {
            global.api.activeTags.push(Tag.create({ label, type: '' }))
            Storage.tags.set({
              value: global.options.saveTags ? global.api.activeTags.map(tag => tag.label) : []
            })
          }

          mouse.left = false
        }
      }
    }
  }
}

export default AutoCompleteResults
