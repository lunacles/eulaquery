import global from '../global.js'
import {
  Element,
  Text,
} from '../elements.js'
import Bar from './bar.js'
import Interpolator from './interpolation.js'
import ClickRegion from './clickregion.js'
import Tag from './tag.js'

import { autoComplete } from '../../src/api/autocomplete.js'
import { mouse } from '../utilities/event.js'

const AutoCompleteResults = class extends Element {
  /**
   * Creates the autocomplete results and the text hook.
   * @public
   * @param {Input} hook - The Input box to monitor to be interpeted by the autocomplete.
   * @returns {AutoCompleteResults} The current instance.
   */
  static create({ hook = null }) {
    if (!hook) throw Error('Invalid text hook!')
    return new AutoCompleteResults(hook)
  }
  constructor(textHook) {
    super()
    this.hook = textHook

    this.cachedText = ''
    this.lastInputTime = Date.now()
    this.results = []
    this.pendingRefresh = false

    this.interpolation = Interpolator.createGroup({ size: 10, speed: 0.2, sharpness: 6 })
    this.clickRegions = Array(10).fill(ClickRegion.create())
  }
  /**
   * Refreshes the results and reloads the displayed results interpolation.
   * @private
   */
  async refreshResults() {
    for (let interpolation of this.interpolation) {
      interpolation.set(0)
      interpolation.freeze(300)
    }
    let text = this.hook.text
    this.results = await autoComplete(text.length > 0 ? text : ' ')
  }
  /**
   * Draws the autocomplete results.
   * @public
   * @param {Number} x - The x-coordinate of the results.
   * @param {Number} y - The y-coordinate of the results.
   * @param {Number} width - The width of the results.
   * @param {Number} height - The height of the results.
   * @param {Number} t - The current time.
   */
  draw({ x = 0, y = 0, width = 0, height = 0, t = 0 } = {}) {
    if (!this.hook || this.hook.text == null || typeof this.hook.text !== 'string') throw Error('Invalid text hook!')
    this.textSize = height * 0.5

    if (this.cachedText !== this.hook.text) {
      this.lastInputTime = t
      this.cachedText = this.hook.text
      this.pendingRefresh = true
    }
    if (this.pendingRefresh && t - this.lastInputTime > 350) {
      console.log('Refreshed query')
      this.pendingRefresh = false

      this.refreshResults()
    }

    let spacing = 5
    for (let i = 0; i < 10; i++) {
      let result = this.results[i]
      let interpolation = this.interpolation[i]
      interpolation.set(1)

      this.clickRegions[i].toggle(result)

      if (result) {
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
          x, y: y + iy,
          width, height
        })
        if (this.clickRegions[i].check() && mouse.left) {
          this.hook.text = ''
          if (!global.api.activeTags.find(tag => tag.label))
            global.api.activeTags.push(Tag.create({ label, type: '' }))
          console.log()
        }
      }
    }
  }
}

export default AutoCompleteResults
