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
  static image(src, local) {
    return new Media('image', src, local)
  }
  /**
   * Creates and loads gif media.
   * @public
   * @param {String} src - The source of the gif.
   * @returns {Media} The current instance for chaining methods.
   */
  static gif(src, local) {
    return new Media('gif', src, local)
  }
  /**
   * Creates and loads video media.
   * @public
   * @param {String} src - The source of the video.
   * @returns {Media} The current instance for chaining methods.
   */
  static video(src, local) {
    return new Media('video', src, local)
  }
  constructor(type, src, local = false) {
    super()
    this.tick = 0

    this.type = type
    this.src = src
    this.local = local

    this.x = 0
    this.y = 0
    this.width = 0
    this.height = 0
    this.element = null

    this.loaded = false
    this.frame = 0
    this.load()
  }
  /**
   * Draws the media to the canvas.
   * @public
   * @param {Number} x - The x-coordinate of the media.
   * @param {Number} y - The y-coordinate of the media.
   * @param {Number} width - The width of the media.
   * @param {Number} height - The height of the media.
   * @returns {this} The current instance for chaining methods.
   */
  async draw({ x = 0, y = 0, width = 0, height = 0}) {
    this.tick++
    if (!this.loaded) return this
    if (this.type === 'gif') {
      if (!this.decoder.complete) return this
      this.ctx.drawImage(this.result.image, x, y, width, height)

      if (this.track.frameCount === 1) return this
      if (this.tick % Math.floor(this.result.image.duration / 1000 / 5) !== 0) return this
      this.frame++
      this.result = await this.decoder.decode({ frameIndex: this.frame, })
      if (this.frame + 1 >= this.track.frameCount)
        this.frame = 0

      return this
    }
    this.ctx.drawImage(this.element, x, y, width, height)

    return this
    //return Rect.draw({ x, y, width, height })
  }
  /**
   * Loads the media.
   * @private
   */
  async load() {
    return new Promise(async (resolve, reject) => {
      this.element = this.type === 'video' ? document.createElement('video') : new Image()
      if (!this.local) {
        let { url, buffer } = await Processor(this.src) // I fucking hate CORS
        this.element.src = url

        if (this.type === 'video') {
          this.element.controls = true
        } else if (this.type === 'gif') {
          this.decoder = new ImageDecoder({
            data: buffer, type: 'image/gif'
          })
          this.result = await this.decoder.decode({ frameIndex: this.frame, })

          this.track = this.decoder.tracks.selectedTrack
        }
      } else {
        this.element.src = this.src
      }

      let event = this.type === 'video' ? 'loadeddata' : 'load'
      this.element.addEventListener(event, () => {
        this.loaded = true
        resolve(this)
      })
      this.element.addEventListener('error', err => reject(err))
    })
  }
  async decode(byteStream) {
    this.decoder = new ImageDecoder({
      data: byteStream, type: 'image/gif'
    })
    await this.decoder.decode({ frameIndex: this.frame, })
  }
}

export default Media
