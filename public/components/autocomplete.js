import global from '../global.js'
import Color from '../color.js'
import {
  Element,
  Bar,
} from '../elements.js'
import Interpolator from './interpolation.js'
import ClickRegion from './clickregion.js'
import Tag from './tag.js'

import { Page } from '../../src/api/post.js'
import { autoComplete } from '../../src/api/autocomplete.js'
import Interaction from '../interaction.js'

import Storage from '../localstorage.js'
import TextObjects from '../textobjects.js'

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
          x, y: this.y + this.bottomY - this.height * 0.5,
          width: this.width, height: this.height
        }).fill(Color.darkGray)

        let [ label, amount ] = result.label.split(/\s(?=\()/)

        let textSize = this.height * 0.5
        TextObjects.autoComplete[i][0].draw({
          x: this.x + spacing * 2, y: this.y + this.bottomY + textSize * 0.5,
          size: textSize,
          text: label.length <= 60 ? label : label.slice(0, 60) + '...',
          align: 'left',
        }).fill(Color.white)
        TextObjects.autoComplete[i][1].draw({
          x: this.x + this.width - spacing * 2, y: this.y + this.bottomY + textSize * 0.5,
          size: textSize,
          text: amount,
          align: 'right',
        }).fill(Color.white)

        this.clickRegions[i].update({
          x: this.x - textSize, y: this.y + this.bottomY - textSize,
          width: this.width + this.height, height: this.height,
        })
        if (this.clickRegions[i].check() && Interaction.mouse.left && !global.clickOverride.tags) {
          this.hook.text = ''
          this.cachedText = this.hook.text
          this.pendingRefresh = true
          if (!global.api.activeTags.find(tag => tag.label === label)) {
            global.api.activeTags.push(Tag.create({ label, type: '' }))
            Storage.tags.set({
              value: global.options.saveTags ? global.api.activeTags.map(tag => tag.label) : []
            })
          }
          //global.api.results = Page.get({ page: global.api.page, tags: global.api.activeTags })
          Interaction.mouse.left = false
        }
      }
    }
  }
}

export default AutoCompleteResults
