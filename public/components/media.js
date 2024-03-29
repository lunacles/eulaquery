import {
  Bar,
  Element,
  Text,
  Poly,
  Line,
} from '../elements.js'
import Profiler from '../profiler.js'
import processor from '../processor.js'
import Color from '../color.js'
import ClickRegion from './clickregion.js'
import Interaction from '../interaction.js'

const downloader = document.createElement('a')
const Media = class extends Element {
  static image(src, skipProcessor) {
    return new Media('image', src, skipProcessor)
  }
  static gif(src, skipProcessor) {
    return new Media('gif', src, skipProcessor)
  }
  static video(src, skipProcessor) {
    return new Media('video', src, skipProcessor)
  }
  constructor(type, src, skipProcessor = false) {
    super()

    this.type = type
    this.src = src
    this.skipProcessor = skipProcessor

    this.x = 0
    this.y = 0
    this.width = 0
    this.height = 0
    this.element = null

    this.loaded = false
    this.frame = 0
    this.frames = []

    this.clickRegion = ClickRegion.create()
    if (this.type === 'video') {
      this.progressClickRegion = ClickRegion.create()
      //this.controllerClickRegion = ClickRegion.create()
      this.stateClickRegion = ClickRegion.create()
      this.downloadClickRegion = ClickRegion.create()
      //this.volumeClickRegion = ClickRegion.create()
      //this.fullScreenClickRegion = ClickRegion.create()
    }

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
  formatTime(time) {
    let minutes = Math.floor(time / 60)
    let seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
  }
  videoInterface() {
    // Progress bar
    let x = this.x + 20
    let y = this.y + this.height - 15
    let width = this.width * 0.9
    let height = 5
    Bar.draw({
      x, y,
      width, height,
    }).fill(Color.darkGray)
    Bar.draw({
      x, y,
      width: width * (this.element.currentTime / this.element.duration), height,
    }).fill(Color.gray)
    this.progressClickRegion.update({
      x: x - height * 0.5, y: y - height * 0.75,
      width: width + height, height: height * 1.5,
    })
    if (this.progressClickRegion.check() && Interaction.mouse.left) {
      let progressAt = Interaction.mouse.x - (this.x + 10)
      this.element.currentTime = this.element.duration * (progressAt / (this.width))
    }

    // Play/pause button
    let stateButtonSize = 20
    this.stateClickRegion.update({
      x, y: y - 15 - stateButtonSize * 0.75,
      width: stateButtonSize, height: stateButtonSize,
    })
    if (!this.element.paused) {
      Line.draw({
        x1: x + 4, y1: y - 15 - stateButtonSize * 0.75,
        x2: x + 4, y2: y - 12,
      }).stroke(Color.white, 5)
      Line.draw({
        x1: x + stateButtonSize - 4, y1: y - 15 - stateButtonSize * 0.75,
        x2: x + stateButtonSize - 4, y2: y - 12,
      }).stroke(Color.white, 5)
      if (this.stateClickRegion.check() && Interaction.mouse.left)
        this.element.pause()
    } else {
      Poly.draw({
        x, y: y - 15 - stateButtonSize * 0.75,
        width: stateButtonSize, height: stateButtonSize,
        path: [
          [7.5, 0],
          [-2.5, 5],
          [-2.5, -5],
        ]
      }).fill(Color.white)
      if (this.stateClickRegion.check() && Interaction.mouse.left)
        this.element.play()
    }

    // Time progress
    Text.draw({
      x: x + stateButtonSize + 5, y: y - 15,
      size: 20,
      align: 'left',
      text: `${this.formatTime(this.element.currentTime)} / ${this.formatTime(this.element.duration)}`
    }).both(Color.white, Color.black, 1.25)

    // Download button
    Line.draw({
      x1: x + width - stateButtonSize * 0.5, y1: y - 15 - stateButtonSize * 0.75,
      x2: x + width - stateButtonSize * 0.5, y2: y - 15 - stateButtonSize * 0.25
    }).stroke(Color.white, 4.5)
    Line.draw({
      x1: x + width - stateButtonSize * 0.3, y1: y - 15 - stateButtonSize * 0.4,
      x2: x + width - stateButtonSize * 0.5, y2: y - 15 - stateButtonSize * 0.25,
    }).stroke(Color.white, 4.5)
    Line.draw({
      x1: x + width - stateButtonSize * 0.7, y1: y - 15 - stateButtonSize * 0.4,
      x2: x + width - stateButtonSize * 0.5, y2: y - 15 - stateButtonSize * 0.25,
    }).stroke(Color.white, 4.5)
    Line.draw({
      x1: x + width - stateButtonSize * 0.85, y1: y - 12.5,
      x2: x + width - stateButtonSize * 0.15, y2: y - 12.5,
    }).stroke(Color.white, 4.5)

    this.downloadClickRegion.update({
      x: x + width - stateButtonSize, y: y - 15 - stateButtonSize * 0.75,
      width: stateButtonSize, height: stateButtonSize,
    })
    if (this.downloadClickRegion.check() && Interaction.mouse.left) {
      downloader.href = this.element.src
      downloader.download = this.src.match(/\/([a-f0-9]+\.mp4)$/i)[1]
      downloader.click()
      Interaction.mouse.left = false
    }
  }
  drawVideo() {
    this.ctx.drawImage(this.element, this.x, this.y, this.width, this.height)
    this.videoInterface()
    // draw video controls
    /*Poly
    this.element.addEventListener('play', e => {

    })
    this.element.addEventListener('pause', e => {

    })*/
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
      if (/*this.type === 'image' || */this.skipProcessor) {
        this.element.src = this.src
        this.element.referrerPolicy = 'no-referrer'
      } else {
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
      }
      if (this.type === 'video') {
        this.element.addEventListener('loadeddata', () => {
          if (this.type === 'video') {
            this.element.play()
            this.element.pause()
          }
          this.loaded = true

          Profiler.logs.media.mark()

          resolve(this)
        })
        this.element.addEventListener('error', err => reject(err))
      } else {
        this.element.decode().then(() => {
          this.loaded = true

          Profiler.logs.media.mark()

          resolve(this)
        })
      }
    })
  }
}

export default Media
