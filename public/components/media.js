import { Element } from '../elements.js'
import Profiler from '../profiler.js'
import processor from '../processor.js'
import global from '../global.js'

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
  drawGif() {
    if (!this.decoder.complete) return this
    let frame = this.frames[this.frame]

    this.ctx.drawImage(frame.image, this.x, this.y, this.width, this.height)

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
  drawImage() {
    this.ctx.drawImage(this.element, this.x, this.y, this.width, this.height)
    return this
  }
  drawVideo() {
    this.ctx.drawImage(this.element, this.x, this.y, this.width, this.height)
    return this
  }
  draw({ x = 0, y = 0, width = 0, height = 0 }) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    if (!this.loaded) return this
    switch (this.type) {
      case 'gif': return this.drawGif()
      case 'image': return this.drawImage()
      case 'video': return this.drawVideo()
    }
  }
  async load() {
    Profiler.logs.media.set()
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
        //if (this.type === 'video')
        //  this.element.play()
        this.loaded = true

        Profiler.logs.media.mark()

        if (global.debug)
          console.log('Media loading time:', `${Profiler.logs.media.sum()}ms`)

        resolve(this)
      })
      this.element.addEventListener('error', err => reject(err))
    })
  }
}

export default Media
