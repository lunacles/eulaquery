import { Element, Rect } from '../elements.js'
import global from '../global.js'
import Processor from '../processor.js'

const Media = class extends Element {
  /**
   * Creates and loads image media.
   * @public
   * @param {String} src - The source of the image.
   * @returns {Media} The current instance for chaining methods.
   */
  static image(src) {
    return new Media('image', src)
  }
  /**
   * Creates and loads video media.
   * @public
   * @param {String} src - The source of the video.
   * @returns {Media} The current instance for chaining methods.
   */
  static video(src) {
    return new Media('video', src)
  }
  constructor(type, src) {
    super()

    this.type = type
    this.src = src

    this.x = 0
    this.y = 0
    this.width = 0
    this.height = 0
    this.element = null

    this.loaded = false
    this.load()
  }
  /**
   * Creates and loads video media.
   * @public
   * @param {Number} x - The x-coordinate of the media.
   * @param {Number} y - The y-coordinate of the media.
   * @param {Number} width - The width of the media.
   * @param {Number} height - The height of the media.
   * @returns {this} The current instance for chaining methods.
   */
  draw({ x = 0, y = 0, width = 0, height = 0}) {
    return this.ctx.drawImage(this.element, x, y, width, height)
    //return Rect.draw({ x, y, width, height })
  }
  async load() {
    return new Promise(async (resolve, reject) => {
      this.element = this.type === 'video' ? document.createElement('video') : new Image()
      if (this.type === 'video') {
        this.element.controls = true
        this.element.src = await Processor(this.src) // I fucking hate CORS
      } else {
        this.element.src = this.src
      }
      let event = this.type === 'video' ? 'loadeddata' : 'load'
      this.element.addEventListener(event, () => {
        this.loaded = true
        console.log(this)
        resolve(this)
      })
      this.element.addEventListener('error', err => reject(err))
    })
  }
}

export default Media
