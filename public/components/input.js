import global from '../global.js'
import { mouse, keyboard } from '../event.js'
import Document from '../document.js'

import {
  Element,
  Text,
  Rect,
  Line,
  Clip,
} from '../elements.js'
import ClickRegion from './clickregion.js'

const Input = class extends Element {
  static create({ onEnter = () => {}, maxLength = 999 }) {
    return new Input(onEnter, maxLength)
  }
  constructor(onEnter, maxLength) {
    super()

    this.x = 0
    this.y = 0
    this.width = 0
    this.height = 0
    this.padding = 0

    this.inBounds = false

    this.text = ''
    this.textWidth = 0
    this.textHeight = 0
    this.maxLength = maxLength

    this.selected = false
    this.selectionAt = 0
    this.selectionLength = 0
    this.initialSelectionAt = 0
    this.initialSelectionLength = 0

    this.selectionStart = 0
    this.selectionEnd = 0
    this.selectionWidth = 0
    this.selectionX = 0

    this.lastTick = false

    this.onEnter = onEnter

    this.clickRegion = ClickRegion.create()
  }
  measureText(start = 0, end = this.text.length) {
    this.ctx.font = `${global.font.style} ${this.height * 0.7}px ${global.font.family}`
    return this.ctx.measureText(this.text.slice(start, end))
  }
  /* Possibly more efficient(?) version of the clickPosition
  clickPosition() {
    // Get the offset the text should be at
    let offset = this.x - this.width * 0.5 - this.textOffset
    let mouseX = mouse.x - offset
    // Binary search to find the closest character
    let low = 0
    let high = this.text.length
    while (low < high) {
      let mid = Math.floor((low + high) / 2)
      let width = this.measureText(0, mid).width
      if (width < mouseX) {
        low = mid + 1
      } else {
        high = mid
      }
    }

    // Set selection position
    this.selectionAt = low
    this.selectionLength = this.measureText(0, low).width
  }
  */
  clickPosition() {
    // Get the offset the text should be at
    let offset = this.x - this.width * 0.5 - this.textOffset
    // Loop through each character and measure it's length to determine if it is in the character to be selected
    // The character and it's previous characters are all measured together to account for kerning anomalies
    for (let i = 0; i < this.text.length; i++) {
      let point = this.measureText(0, i).width
      let nextPoint = this.measureText(0, i + 1).width
      let middle = (point + nextPoint) * 0.5
      if (mouse.x <= middle + offset) {
        this.selectionAt = i
        this.selectionLength = this.measureText(0, i).width
        return
      }
    }
    this.selectionAt = this.text.length
    this.selectionLength = this.textWidth
  }
  updateSelection() {
    this.selectionStart = Math.min(this.initialSelectionAt, this.selectionAt)
    this.selectionEnd = Math.max(this.initialSelectionAt, this.selectionAt)
    this.selectionWidth = this.measureText(this.selectionStart, this.selectionEnd).width
    this.selectionX = this.measureText(0, this.selectionStart).width
  }
  mouseTracking() {
    // Check if the mouse is currently within the input boundary
    this.clickRegion.update({
      x: this.x - this.width * 0.5 - this.padding * 0.5, y: this.y - this.height * 0.5 - this.padding,
      width: this.width + this.padding, height: this.height + this.padding,
    })
    this.inBounds = this.clickRegion.check()
    // Set the cursor to text if the mouse is within the input boundary
    this.ctx.canvas.style.cursor = this.inBounds ? 'text' : 'default'

    // If the mouse is left clicked, select the text
    if (mouse.left || mouse.held) {
      let mobile = Document.width / Document.height < 1
      let withinKeyboard = this.selected && mobile && mouse.y > Document.height - 650
      this.selected = this.inBounds || withinKeyboard

      if (this.selected) {
        if (!global.keyboard.state && mobile)
          global.keyboard.open()
        if (!withinKeyboard)
          this.clickPosition()
      } else if (global.keyboard.state) {
        global.keyboard.close()
      }
      // Check if left click is being held down
      if (!this.lastTick && mouse.held) {
        this.lastTick = true

        this.initialSelectionAt = this.selectionAt
        this.initialSelectionLength = this.selectionLength
      }
    } else {
      this.lastTick = false
    }
  }
  keyboardTracking() {
    // If the zone hasn't been selected or the text length is exceeding the max length return
    if (!this.selected || !keyboard.e) return
    let key = keyboard.e.key

    // Get the start and end of our selection
    let start = Math.min(this.initialSelectionAt, this.selectionAt)
    let end = Math.max(this.initialSelectionAt, this.selectionAt)

    // Reset the selection back to it's original state
    let resetSelection = () => {
      this.selectionAt = start
      this.initialSelectionAt = start
      this.selectionLength = this.measureText(0, start).width
      this.initialSelectionLength = this.selectionLength
    }

    if (key.length > 1) {
      switch (keyboard.e.key) {
        case 'Backspace':
          if (start === end || start === this.text.length)
            start--
          this.text = this.text.slice(0, start) + this.text.slice(end)
          resetSelection()
          break
        case 'ArrowLeft':
        case 'ArrowRight':
          let increment = (keyboard.e.keyCode - 38) * -1
          this.initialSelectionAt -= increment
          this.initialSelectionLength = this.measureText(0, this.initialSelectionAt).width
          if (keyboard.e.shiftKey) break
          this.selectionAt -= increment
          this.selectionLength = this.measureText(0, this.selectionAt).width
          break
        case 'Enter':
          try {
            this.onEnter()
          } catch (err) {
            throw err
          }
          break
        case 'Tab':
          // TODO
          break
      }
    } else {
      if (this.text.length >= this.maxLength) return
      if (start === this.text.length) {
        this.text += key
      } else {
        this.text = this.text.slice(0, start) + key + this.text.slice(end)
      }
      start += key.length
      resetSelection()
    }
  }
  draw({ x = 0, y = 0, width = 0, height = 0, padding = 0, t = 0 } = {}) {
    // Set the dimensions
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.padding = padding

    // Gather some useful text metrics
    let textMetrics = this.measureText()
    this.textWidth = textMetrics.width
    this.textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent

    // Run important mouse and keyboard related functions
    this.keyboardTracking()
    this.mouseTracking()

    // Get the dimensions of the top left and the text offset if the text exceeds the box boundary
    let left = this.x - this.width * 0.5
    let right= this.y - this.height * 0.5
    let border = Math.max(3, this.height * 0.2)
    this.textOffset = Math.max(0, this.textWidth - this.width + this.height)

    // Start the canvas clipping
    let clip = Clip.start({
      x: left - this.padding,
      y: right - this.padding,
      width: this.width + this.padding,
      height: this.height + this.padding,
    })

    // Update our current selection and draw a highlight if necessary
    this.updateSelection()
    Rect.draw({
      x: left - this.textOffset + this.selectionX, y: right - this.padding * 0.5,
      width: this.selectionWidth, height: this.height + this.padding * 0.25,
    }).fill('#3297fd')

    // Draw the input text
    Text.draw({
      x: left - this.textOffset,
      y: right + this.height * 0.95 - border,
      size: this.height * 0.7,
      text: this.text,
      align: 'left',
    }).fill(global.colors.white)

    // Draw the editing position indicator
    if (Math.floor(t / 600) % 2 === 0 && this.selected) {
      Line.draw({
        x1: left - this.textOffset + this.initialSelectionLength, y1: right - this.padding * 0.5,
        x2: left - this.textOffset + this.initialSelectionLength, y2: right + this.height - this.padding * 0.5,
      }).stroke(global.colors.white, 2.5)
    }

    Clip.end(clip)

    return this
  }
}

export default Input
