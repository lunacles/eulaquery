import { Element, } from '../elements.js'
import * as util from '../utilities/util.js'

const Interpolator = class extends Element {
  static create({ speed, sharpness }) {
    return new Interpolator(0, speed, sharpness)
  }
  static createGroup({ size, speed, sharpness }) {
    return new Array(size).fill(new Interpolator(0, speed, sharpness))
  }
  constructor(interpolation, speed, sharpness = 3) {
    super()

    this.interpolation = interpolation
    this.speed = speed
    this.sharpness = sharpness
    this.time = Date.now()
    this.display = interpolation
    this.old = interpolation
    this.frozen = false
  }
  async freeze(time) {
    this.frozen = true
    await util.sleep(time)
    this.frozen = false
  }
  set(value) {
    if (this.interpolation !== value && !this.frozen) {
      this.old = this.get()
      this.interpolation = value
      this.time = Date.now()
    }
    return this
  }
  get() {
    let seconds = (Date.now() - this.time) / 1000
    let curve = 1 - Math.pow(1 - seconds / this.speed, this.sharpness)

    if (seconds >= this.speed) {
      this.display = this.interpolation
    } else {
      this.display = this.old + (this.interpolation - this.old) * curve
    }

    return this.display
  }
  forceDisplay(value) {
    this.old = value
    this.display = value
  }
}

export default Interpolator
