import {
  Line,
  Poly,
  Rect,
  RoundRect,
  Text,
} from '../elements.js'
import X from './x.js'
import ClickRegion from './clickregion.js'
import Interpolator from './interpolation.js'

import { mouse, keyboard } from '../event.js'
import Document from '../document.js'
import global from '../global.js'
import * as util from '../util.js'

const layouts = {
  QWERTY: {
    alphabetical: [
      ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
      ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
      ["Shift", "z", "x", "c", "v", "b", "n", "m", "Backspace"],
      ["SwapNumeric", "/", " ", "Space", ".", "Enter"],
    ],
    numeric: [
      ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
      ["@", "#", "$", "_", "&", "-", "+", "(", ")", "/"],
      ["Empty", "*", "\"", "'", ":", ";", "!", "?", "Backspace"],
      ["SwapAlphabetical", ",", " ", "Space", ".", "Enter"]
    ]
  }
}
let menu = 'alphabetical'

const Key = class {
  static create(key) {
    return new Key(key)
  }
  constructor(key) {
    this.key = key

    this.x = 0
    this.y = 0
    this.width = 0
    this.height = 0
    this.tick = 0
    this.maxDeleteSpeed = 0

    this.clickRegion = ClickRegion.create()

    this.interpolation = Interpolator.create({ speed: 0.1, sharpness: 3 })
  }
  draw({ x = 0, y = 0, width = 0, height = 0 }) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.tick++

    this.clickRegion.update({
      x: this.x, y: this.y,
      width: this.width, height: this.height
    })

    this.interpolation.set(this.clickRegion.check() && (mouse.left || mouse.held) ? 0.1 : 0)
    if (this.clickRegion.check() && (mouse.left || (this.key === 'Backspace' && mouse.held && this.tick > this.maxDeleteSpeed))) {
      this.tick = 0

      switch (this.key) {
        case 'SwapNumeric':
          menu = 'numeric'
          break
        case 'SwapAlphabetical':
          menu = 'alphabetical'
          break
        default:
          keyboard.e = new Event('keydown')
          keyboard.e.key = this.key === 'Space' ? ' ' : this.key
          canvas.dispatchEvent(keyboard.e)
      }
    }

    RoundRect.draw({
      x: this.x, y: this.y,
      width: this.width, height: this.height,
      radii: [10, 10, 10, 10],
    }).fill(util.mixColors(global.colors.darkGray, global.colors.lightBlue,
      (['Shift', 'Backspace', '.', 'Empty', ','].includes(this.key) || this.key === '/' && menu === 'alphabetical' ? 0.2 :
      ['SwapNumeric', 'SwapAlphabetical', 'Enter'].includes(this.key) ? 0.4 : 0.075) + this.interpolation.get()
    ))

    this.icon()

    this.maxDeleteSpeed = mouse.held ? Math.max(5, this.maxDeleteSpeed - 0.5) : 50
  }
  icon() {
    let textSize = this.height * 0.5
    switch (this.key) {
      case 'Backspace':
        Poly.draw({
          x: this.x + this.width * 0.15, y: this.y + this.height * 0.25,
          width: this.width * 0.6, height: this.height * 0.5,
          path: [
            [-5, 0],
            [-2.5, 5],
            [5, 5],
            [5, -5],
            [-2.5, -5],
          ]
        }).stroke(global.colors.white, 5)

        X.draw({
          x: this.x + (this.width * 0.5) * 0.85, y: this.y + (this.height * 0.5) * 0.85,
          width: this.width * 0.15, height: this.width * 0.15
        }).stroke(global.colors.white, 5)
        break
      case 'Shift':
        Poly.draw({
          x: this.x + this.width * 0.25, y: this.y + this.height * 0.25,
          width: this.width * 0.5, height: this.height * 0.5,
          path: [
            [0, -5],
            [-5, 1],
            [-2, 1],
            [-2, 5],
            [2, 5],
            [2, 1],
            [5, 1]
          ]
        }).stroke(global.colors.white, 5)
        break
      case 'Enter':
        Line.draw({
          x1: this.x + this.width * 0.3, y1: this.y + this.height * 0.5,
          x2: this.x + this.width * 0.7, y2: this.y + this.height * 0.5,
        }).stroke(global.colors.white, 5)
        Line.draw({
          x1: this.x + this.width * 0.7, y1: this.y + this.height * 0.5,
          x2: this.x + this.width * 0.6, y2: this.y + this.height * 0.375,
        }).stroke(global.colors.white, 5)
        Line.draw({
          x1: this.x + this.width * 0.7, y1: this.y + this.height * 0.5,
          x2: this.x + this.width * 0.6, y2: this.y + this.height * 0.625,
        }).stroke(global.colors.white, 5)
        break
      case 'SwapNumeric':
        Text.draw({
          x: this.x + this.width * 0.5, y: this.y + textSize * 1.3,
          size: textSize * 0.75,
          text: '?123',
        }).fill(global.colors.white)
        break
      case 'SwapAlphabetical':
        Text.draw({
          x: this.x + this.width * 0.5, y: this.y + textSize * 1.3,
          size: textSize * 0.75,
          text: 'ABC',
        }).fill(global.colors.white)
        break
      case 'Empty':
      case 'Space':
        break
      default:
        Text.draw({
          x: this.x + this.width * 0.5, y: this.y + textSize * 1.4,
          size: textSize,
          text: this.key,
        }).fill(global.colors.white)
    }
  }
}

const Keyboard = class {
  static create(type = 'QWERTY',) {
    return new Keyboard(type)
  }
  constructor(type) {
    this.layout = layouts[type]
    this.y = 0
    this.rowSpacing = 20
    this.spacing = 15

    this.keyWidth = 0
    this.keyHeight = 0

    let createBoard = type => {
      let board = []
      for (let row of this.layout[type]) {
        let keys = []
        for (let key of row)
          keys.push(Key.create(key))

        board.push(keys)
      }
      return board
    }

    this.board = {
      alphabetical: createBoard('alphabetical'),
      numeric: createBoard('numeric'),
    }

    this.state = false

    this.interpolation = Interpolator.create({ speed: 0.15, sharpness: 3 })
    this.close()

    this.interpolation.forceDisplay(1)
  }
  open() {
    this.interpolation.set(0)
    this.state = true
  }
  close() {
    this.interpolation.set(1)
    this.state = false
  }
  draw({ y = 0, spacing = 10 }) {
    this.y = y + (Document.height - y) * this.interpolation.get()
    this.spacing = spacing
    this.keyWidth = Document.width / 10 - this.spacing * 1.25
    let rows = this.board[menu]
    this.keyHeight = (Document.height - y - this.rowSpacing * rows.length) / rows.length

    Rect.draw({
      x: 0, y: this.y,
      width: Document.width, height: Document.height - y
    }).fill(global.colors.darkGray)

    for (let [iy, row] of rows.entries()) {
      this.offset = (Document.width - (this.spacing + row.reduce((a, b) => a + this.getKeySize(b.key) + this.spacing, 0))) * 0.5
      for (let key of row) {
        this.drawKey({ key, row: iy })
      }
    }

    return this
  }
  getKeySize(key) {
    switch(key) {
      case 'Shift':
      case 'Backspace':
      case 'SwapNumeric':
      case 'SwapAlphabetical':
      case 'Enter':
      case 'Empty':
        return this.keyWidth * 1.5 + this.spacing
      case 'Space':
        return (this.keyWidth + this.spacing) * 4
      default:
        return this.keyWidth
    }
  }
  drawKey({ key = null, row = 0 }) {
    let width = this.getKeySize(key.key)

    key.draw({
      x: this.spacing + this.offset, y: this.y + this.rowSpacing * 0.5 + (this.keyHeight + this.rowSpacing) * row,
      width, height: this.keyHeight,
    })

    this.offset += width + this.spacing
  }
}

export default Keyboard
