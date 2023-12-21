import { mouse } from '../utilities/event.js'

const ClickRegion = class {
  /**
   * Creates a new ClickRegion instance and applies the provided dimensions.
   * @public
   * @param {Number} x - The x-coordinate of the region.
   * @param {Number} y - The y-coordinate of the region.
   * @param {Number} width - The width of the region.
   * @param {Number} height - The height of the region.
   * @returns {ClickRegion} The current instance.
   */
  static create({ x = 0, y = 0, width = 0, height = 0 } = {}) {
    return new ClickRegion(x, y, width, height)
  }
  constructor(x, y, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height

    this.active = true
  }
  /**
   * Updates the ClickRegion position and dimensions.
   * @public
   * @param {Number} x - The new x-coordinate of the region.
   * @param {Number} y - The new y-coordinate of the region.
   * @param {Number} width - The new width of the region.
   * @param {Number} height - The new height of the region.
   */
  update({ x = 0, y = 0, width = 0, height = 0 } = {}) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }
  /**
   * Checks the mouse position relative to the region boundaries.
   * @public
   * @param {Number} x - The new x-coordinate of the region.
   * @param {Number} y - The new y-coordinate of the region.
   * @param {Number} width - The new width of the region.
   * @param {Number} height - The new height of the region.
   * @returns {Bool} Whether the mouse is currently within or not within the provided boundaries.
   */
  check() {
    if (!this.active) return false
    return mouse.x >= this.x + this.width * -0.5 && mouse.x < this.x + this.width * 0.5 && mouse.y >= this.y + this.height * -0.5 && mouse.y < this.y + this.height * 0.5
  }
  /**
   * Toggles whether the ClickRegion will accept checks or not.
   * @public
   * @param {Bool} state - The toggle state.
   */
  toggle(state) {
    this.active = state
  }
}

export default ClickRegion
