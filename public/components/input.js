import global from '../global.js'
import Interaction from '../interaction.js'
import Color from '../color.js'

import {
  Element,
} from '../elements.js'
import ClickRegion from './clickregion.js'

const Input = class extends Element {
  static create({ onEnter = () => {}, maxLength = 999, placeholder = '', placeholderColor = '' }) {
    return new Input(onEnter, maxLength, placeholder, placeholderColor)
  }
  static array = []
  static removeDisabledInputs() {
    for (let input of Input.array) {
      if (input.enabled) {
        input.enabled = false
        continue
      }

      if (input.inputBox) {
        input.inputBox.blur()
        input.inputBox.remove()
      }
    }
  }
  constructor(onEnter, maxLength, placeholder, placeholderColor) {
    super()
    Input.array.push(this)

    this.x = 0
    this.y = 0
    this.width = 0
    this.height = 0

    this.value = ''

    this.placeholder = placeholder
    this.placeholderColor = placeholderColor

    this.maxLength = maxLength

    this.textSize = 0

    this.onEnter = onEnter

    this.clickRegion = ClickRegion.create()
    this.focused = false

    this.inputBox = this.createInput()

    this.enabled = true
  }
  set text(value) {
    this.value = value
    this.inputBox.value = value
  }
  get text() {
    return this.inputBox?.value ?? this.value
  }
  createInput() {
    let inputBox = document.createElement('input')
    inputBox.spellcheck = false
    inputBox.autocomplete = 'off'
    inputBox.tabIndex = -1
    inputBox.maxLength = this.maxLength
    inputBox.placeholder = this.placeholder
    return inputBox
  }
  insert() {
    if (!this.inputBox.parentNode)
      document.body.appendChild(this.inputBox)

    this.inputBox.style.width = `${this.width}px`
    this.inputBox.style.height = `${this.height}px`
    this.inputBox.style.left = `${this.x}px`
    this.inputBox.style.top = `${this.y}px`
    this.inputBox.style.border = 'none'
    this.inputBox.style.outline = 'none'
    this.inputBox.style.margin = 0
    this.inputBox.style.padding = 0
    this.inputBox.style.backgroundColor = 'transparent'
    this.inputBox.style.position = 'absolute'
    this.inputBox.style.font = `${global.font.style} ${this.textSize}px ${global.font.family}`
    this.inputBox.style.color = `rgba(${this.textColor[0]}, ${this.textColor[1]}, ${this.textColor[2]})`
  }
  focus() {
    this.clickRegion.update({
      x: this.x, y: this.y,
      width: this.width, height: this.height,
      debug: true
    })

    if (Interaction.mouse.left) {
      if (this.clickRegion.check()) {
        this.inputBox.focus()
      } else {
        this.inputBox.blur()
      }
    }
  }
  draw({ x = 0, y = 0, width = 0, height = 0, textSize = 0, } = {}) {
    this.width = width
    this.height = height
    this.textSize = textSize
    this.x = x
    this.y = y

    this.focused = document.activeElement === this.inputBox
    if (this.focused)
      this.value = this.inputBox.value

    this.setCache('input', ({ fill, stroke, lineWidth }) => {
      this.textColor = Color.hexToRgb(fill)
      this.insert()
      this.focus()
    })

    this.enabled = true
    return this
  }
}

export default Input
