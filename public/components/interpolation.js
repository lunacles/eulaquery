import { Element, } from '../elements.js'
import * as util from '../utilities/util.js'

const Interpolator = class extends Element {
  /**
   * Creates a new interpolation instance and applies a speed and sharpness to it.
   * @public
   * @param {Number} speed - The speed of the transition.
   * @param {Number} sharpness - How sharp the translation is.
   * @returns {Interpolator} The current instance.
   */
  static create({ speed, sharpness }) {
    return new Interpolator(0, speed, sharpness)
  }
  /**
   * Creates a new interpolation instance and applies a speed and sharpness to it.
   * @public
   * @param {Number} size - The amount of interpolation instances returned.
   * @param {Number} speed - The speed of the transition.
   * @param {Number} sharpness - How sharp the translation is.
   * @returns {Array<Interpolator>} An array of the instances.
   */
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
  /**
   * Freezes the interpolation for a given period.
   * @public
   * @param {Number} time - How long in milliseconds that the interpolation is for.
   */
  async freeze(time) {
    this.frozen = true
    await util.sleep(time)
    this.frozen = false
  }
  /**
   * Sets the goal value of the interpolation.
   * @public
   * @param {Number} value - The numeric goal to transition to.
   */
  set(value) {
    if (this.interpolation !== value && !this.frozen) {
      this.old = this.get()
      this.interpolation = value
      this.time = Date.now()
    }
  }
  /**
   * @public
   * @returns {Number} The current value of the transition.
   */
  get() {
    let seconds = (Date.now() - this.time) / 1000
    let curve = 1 / (1 + Math.exp(-(((seconds / this.speed) * 2 - 1) * this.sharpness)))

    if (seconds >= this.speed) {
      this.display = this.interpolation
    } else {
      this.display = this.old + (this.interpolation - this.old) * curve
    }

    return this.display
  }
}

export default Interpolator
