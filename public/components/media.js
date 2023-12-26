import { Element, Rect } from '../elements.js'
import global from '../global.js'
import processor from '../processor.js'

const Media = class extends Element {
  static image(src, local) {
    return new Media('image', src, local)
  }
  static gif(src, local) {
    return new Media('gif', src, local)
  }
  static video(src, local) {
    return new Media('video', src, local)
  }
  constructor(type, src, local = false) {
    super()

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
    this.frames = []
    this.load()
  }
  draw({ x = 0, y = 0, width, height }) {
    if (!this.loaded) return this

    if (this.type === 'gif') {
      if (!this.decoder.complete) return this
      let frame = this.frames[this.frame]

      this.ctx.drawImage(frame.image, x, y, width, height)

      if (this.track.frameCount === 1) return this

      let now = performance.now()
      let frameDuration = frame.image.duration / 1000

      if (now > this.startTime + frameDuration) {
        this.frame++
        if (this.frame >= this.track.frameCount)
          this.frame = 0

        this.startTime = now
      }
      return this
    }

    this.ctx.drawImage(this.element, x, y, width, height)
    return this
  }
  async load() {
    return new Promise(async (resolve, reject) => {
      this.element = this.type === 'video' ? document.createElement('video') : new Image()
      if (!this.local) {
        let { url, buffer } = await processor(this.src) // I fucking hate CORS
        this.element.src = url

        if (this.type === 'video') {
          this.element.controls = true
        } else if (this.type === 'gif') {
          this.decoder = new ImageDecoder({
            data: buffer, type: 'image/gif'
          })
          this.result = await this.decoder.decode({ frameIndex: this.frame, })
          this.frames.push(this.result)
          this.startTime = performance.now()
          this.track = this.decoder.tracks.selectedTrack

          for (let i = this.frame + 1; i < this.track.frameCount; i++) {
            let result = await this.decoder.decode({ frameIndex: i, })
            this.frames.push(result)
          }
          this.loaded = true
        }
      } else {
        this.element.src = this.src
      }
      let event = this.type === 'video' ? 'loadeddata' : 'load'
      this.element.addEventListener(event, () => {
        console.log(this.type)
        console.log(this)
        if (this.type === 'video')
          this.element.play()
        this.loaded = true
        resolve(this)
      })
      this.element.addEventListener('error', err => reject(err))
    })
  }
}

export default Media
