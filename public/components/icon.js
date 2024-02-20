import Color from '../color.js'
import {
  Arc,
  Line,
  Poly,
  Rect,
} from '../elements.js'

import Interpolator from './interpolation.js'

const Icon = class {
  static create(type) {
    return new Icon(type)
  }
  constructor(type) {
    this.type = type
    if (this[this.type] == null) throw new Error(`"${this.type}" is not a valid Icon.`)

    this.x = 0
    this.y = 0
    this.width = 0
    this.height = 0

    this.state = false
    this.hook = null
    this.interpolator = Interpolator.create({ speed: 0.3, sharpness: 3 })
  }
  addToggle(hook) {
    this.hook = hook
    return this
  }
  account() {
    //let state = this.interpolator.get()
    let centerX = this.x + this.width * 0.5
    let centerY = this.y + this.height * 0.5
    let radius = this.width * 0.5

    // Body
    Rect.draw({
      x: centerX - this.width / 3 * 2, y: centerY + this.height * 0.5,
      width: this.width + this.width / 3, height: this.height * 0.5
    }).fill(Color.white)
    Arc.draw({
      x: centerX, y: centerY + this.height * 0.525,
      radius: radius + this.width * 0.16,
      startAngle: Math.PI, endAngle: 0
    }).fill(Color.white)
    Arc.draw({
      x: centerX, y: centerY - this.height * 0.25,
      radius: radius * 1.25,
      startAngle: 0, endAngle: Math.PI
    }).fill(Color.burple)

    // Head
    Arc.draw({
      x: centerX, y: centerY - this.height * 0.3,
      radius,
      startAngle: Math.PI, endAngle: 0
    }).fill(Color.white)
    Arc.draw({
      x: centerX, y: centerY - this.height * 0.3,
      radius,
      startAngle: 0, endAngle: Math.PI
    }).fill(Color.white)
  }
  hamburger() {
    let state = this.interpolator.get()
    let centerX = this.x + this.width * 0.5
    let shrinkX = this.width * 0.5 * (1 - state)

    let centerY = this.y + this.height * 0.5
    let shrinkY = this.height * 0.5 * state

    let y1 = this.y + shrinkY
    let y2 = this.y + this.height - shrinkY

    Line.draw({
        x1: centerX - shrinkX, y1: y1,
        x2: centerX + shrinkX, y2: y1
    }).stroke(Color.white, this.height / 4)

    Line.draw({
        x1: centerX - shrinkX, y1: y2,
        x2: centerX + shrinkX, y2: y2
    }).stroke(Color.white, this.height / 4)

    Line.draw({
        x1: this.x, y1: centerY - shrinkY,
        x2: this.x + this.width, y2: centerY + shrinkY
    }).stroke(Color.white, this.height / 4)

    Line.draw({
        x1: this.x + this.width, y1: centerY - shrinkY,
        x2: this.x, y2: centerY + shrinkY
    }).stroke(Color.white, this.height / 4)
  }
  arrow() {
    let state = 1 - this.interpolator.get()
    let centerX = this.x + this.width * 0.5
    let centerY = this.y + this.height * 0.5

    let lineLength = Math.min(this.width, this.height) / 2
    let rotCenterX = centerX - lineLength * 0.5
    let rotCenterY = centerY

    let angle = Math.PI * state

    let rotatePoint = (x, y) => {
      let cosTheta = Math.cos(angle)
      let sinTheta = Math.sin(angle)
      return {
        x: rotCenterX + (x - rotCenterX) * cosTheta - (y - rotCenterY) * sinTheta,
        y: rotCenterY + (x - rotCenterX) * sinTheta + (y - rotCenterY) * cosTheta
      }
    }

    let p1 = rotatePoint(centerX, centerY)
    let p2 = rotatePoint(centerX + Math.cos(3 * Math.PI / 4) * lineLength, centerY + Math.sin(3 * Math.PI / 4) * lineLength)
    let p3 = rotatePoint(centerX + Math.cos(5 * Math.PI / 4) * lineLength, centerY + Math.sin(5 * Math.PI / 4) * lineLength)

    Line.draw({
        x1: p1.x, y1: p1.y,
        x2: p2.x, y2: p2.y
    }).stroke(Color.white, this.height / 4)

    Line.draw({
        x1: p1.x, y1: p1.y,
        x2: p3.x, y2: p3.y
    }).stroke(Color.white, this.height / 4)
  }
  google() {
    let radius = this.height * 0.5
    let lineWidth = this.width * 0.25
    Arc.draw({
      x: this.x + this.width * 0.5, y: this.y + this.height * 0.5,
      startAngle: 3.375, endAngle: -0.75,
      radius,
    }).lineCap('butt').stroke(Color.googleRed, lineWidth)

    Arc.draw({
      x: this.x + this.width * 0.5, y: this.y + this.height * 0.5,
      startAngle: 2.5, endAngle: 3.625,
      radius,
    }).lineCap('butt').stroke(Color.googleYellow, lineWidth)

    Arc.draw({
      x: this.x + this.width * 0.5, y: this.y + this.height * 0.5,
      startAngle: 0.75, endAngle: 2.625,
      radius,
    }).lineCap('butt').stroke(Color.googleGreen, lineWidth)

    Arc.draw({
      x: this.x + this.width * 0.5, y: this.y + this.height * 0.5,
      startAngle: 0, endAngle: 1,
      radius,
    }).lineCap('butt').stroke(Color.googleBlue, lineWidth)

    Line.draw({
      x1: this.x + this.width * 0.5, y1: this.y + this.height * 0.5,
      x2: this.x + this.width + lineWidth * 0.475, y2: this.y + this.height * 0.5
    }).lineCap('butt').stroke(Color.googleBlue, lineWidth)
  }
  draw({ x = 0, y = 0, width = 0, height = 0 }) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height

    this.state = this.hook?.state

    this.interpolator.set(this.state ? 1 : 0)
    this[this.type]()
  }
}

export default Icon
