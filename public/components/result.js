import global from '../global.js'
import { mouse } from '../event.js'
import Document from '../document.js'

import {
  Element,
  RoundRect,
  Text,
  Circle,
  Clip,
  Poly,
} from '../elements.js'
import ClickRegion from './clickregion.js'

const Result = class extends Element {
  static draw({ result = {}, filter = [], x = 0, y = 0, width = 0, height = 0 }) {
    return new Result(result, filter, x, y, width, height)
  }
  constructor(result, filter, x, y, width, height) {
    super()

    this.result = result
    this.filter = filter
    this.selected = false
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.spacing = 10
    this.border = 5

    this.clickRegion = ClickRegion.create()

    this.draw()
  }
  drawFileType(type) {
    let size = 20
    RoundRect.draw({
      x: this.x + this.spacing * 2 - size * 0.5, y: this.y + this.spacing * 2 - size * 0.5,
      width: this.measureText(type.toUpperCase(), size).width + size, height: size * 2,
      radii: [5, 5, 5, 5]
    }).alpha(0.75).fill(global.colors.black)
    Text.draw({
      x: this.x + this.spacing * 2, y: this.y + this.spacing * 2 + size * 0.75,
      size: size,
      text: type.toUpperCase(),
      align: 'left',
    }).fill(global.colors.white)
  }
  draw() {
    Clip.rect({
      x: this.x, y: this.y,
      width: this.width, height: this.height
    })

    RoundRect.draw({
      x: this.x, y: this.y,
      width: this.width, height: this.height,
      radii: [10, 10, 10, 10]
    }).fill(global.colors.navyBlue)

    if (this.filter.length > 0) {
      Text.draw({
        x: this.x + this.width * 0.5, y: this.y + 5 + this.height / 3,
        align: 'center',
        size: this.height / 3,
        text: `Filtered For: ${this.filter.join(', ')}`
      }).fill(global.colors.white)
      Text.draw({
        x: this.x + this.width * 0.5, y: this.y + 10 + this.height / 1.5,
        align: 'center',
        size: this.height / 3,
        text: 'Click here to view'
      }).fill(global.colors.white)

    } else {
      let positionAndSize = {
        x: this.x + this.border * 0.5, y: this.y + this.border * 0.5,
        width: this.width - this.border, height: this.height - this.border,
      }
      if (this.result.file.type === 'video') {
        if (global.api.selectedPost !== this.result) {
          if (this.result.thumbnail.loaded)
            this.result.thumbnail.draw(positionAndSize)

          let playSize = Math.min(this.width, this.height) * 0.25

          Circle.draw({
            x: this.x + this.width * 0.5, y: this.y + this.height * 0.5,
            radius: playSize,
          }).alpha(0.75).fill(global.colors.white)
          Poly.draw({
            x: this.x + this.width * 0.5 - playSize * 0.45, y: this.y + this.height * 0.5 - playSize * 0.5,
            width: playSize, height: playSize,
            path: [
              [7.5, 0],
              [-2.5, 5],
              [-2.5, -5],
            ]
          }).alpha(0.75).fill(global.colors.black)
        } else if (!this.result.file.src) {
          this.result.loadFile()
        } else if (this.result.file.src && this.result.file.src.loaded) {
          this.result.file.src.draw(positionAndSize)
        }
      } else if (!this.result.file.src) {
        this.result.loadFile()
      } else if (this.result.file.src && this.result.file.src.loaded) {
        this.result.file.src.draw(positionAndSize)
      }
    }
    RoundRect.draw({
      x: this.x, y: this.y,
      width: this.width, height: this.height,
      radii: [15, 15, 15, 15]
    }).stroke(global.colors.navyBlue, 10)

    Clip.end()

    this.clickRegion.update({
      x: this.x, y: this.y,
      width: this.width, height: this.height
    })

    if (this.clickRegion.check() && (Document.holdTime > 5 && !mouse.moving) && global.api.selectedPost !== this.result) {
      global.api.selectedPost = this.result
    }

    return this
  }
}

export default Result