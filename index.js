import {
  Rect,
  Circle,
  Text,
} from './public/elements.js'
import Input from './public/components/input.js'
import AutoCompleteResults from './public/components/autocomplete.js'
import Bar from './public/components/bar.js'
import Media from './public/components/media.js'
import Interpolator from './public/components/interpolation.js'

import global from './public/global.js'
import Document from './public/document.js'

import * as util from './public/utilities/util.js'

let searchBar = Input.create({ onEnter: () => {}, maxLength: 25 })
let searchBarResults = AutoCompleteResults.create({ hook: searchBar })

const placeholder = {
  spacing: 5,
  titleSize: 75,
  searchBarWidth: 400,
  searchBarHeight: 50,
}
let fade = Interpolator.create({ speed: 1, sharpness: 2 })
fade.set(0)
let icon = Media.image('./grimheart.svg')

const Snowfall = class {
  constructor(max) {
    this.max = max
    this.particles = Array(max).fill().map(() => ({
      x: Math.random() * Document.width,
      y: Math.random() * Document.height,
      r: Math.random() * 8 + 1,
      d: Math.random() * this.max
    }))

    this.angle = 0
  }
  draw() {
    for (let particle of this.particles) {
      Circle.draw({
        x: particle.x, y: particle.y, radius: particle.r
      }).alpha(0.98).fill(global.colors.white)
    }
    this.update()
  }
  update() {
    this.angle += 0.005
    for (let [i, particle] of this.particles.entries()) {
      particle.x += Math.sin(this.angle) * 2
      particle.y += Math.cos(this.angle + particle.d) + 1 + particle.r / 10

      if (particle.x > Document.width + 5 || particle.x < -5 || particle.y > Document.height) {
        if (i % 3 > 0) {
          this.particles[i] = {
            x: Math.random() * Document.width, y: -10,
            r: particle.r, d: particle.d
          }
        } else {
          if (Math.sin(this.angle) > 0) {
            this.particles[i] = {
              x: -5, y: Math.random() * Document.height,
              r: particle.r, d: particle.d
            }
          } else {
            this.particles[i] = {
              x: Document.width + 5, y: Math.random() * Document.height,
              r: particle.r, d: particle.d
            }
          }
        }
      }
    }
  }
}
let snow = new Snowfall(50)

const UI = {
  background() {
    Rect.draw({
      x: 0, y: 0,
      width: Document.width * 2, height: Document.height * 2,
    }).fill(global.colors.bgBlack)

    snow.draw()

    if (icon.loaded) {
      fade.set(1)
      let size = Document.height * 0.75
      if (Document.width < Document.height)
        size = Document.width

      icon.alpha(Math.max(0, fade.get() - 0.3)).draw({
        x: Document.centerX - size * 0.5, y: Document.centerY - size * 0.375,
        width: size, height: size
      })
    }

    Rect.draw({
      x: 0, y: 0,
      width: Document.width * 2, height: Document.height * 2,
    }).alpha(0.98).fillRadialGradient({
      x1: Document.centerX, y1: Document.height * 1.75, r1: Document.height * 3,
      x2: Document.centerX, y2: Document.height * 2, r2: 0,
      gradient: [{ color: global.colors.bgBlack, pos: 0.5, }, { color: util.mixColors(global.colors.white, global.colors.navyBlue, 0.9), pos: 1 }]
    })
  },
  title() {
    let eulaWidth = util.measureText('Eula', 50).width * 2
    let queryWidth = util.measureText('query', 50).width * 2
    let offset = (eulaWidth - queryWidth) * 0.25
    Text.draw({
      x: Document.centerX + offset, y: placeholder.titleSize,
      size: placeholder.titleSize,
      text: 'Eula',
      align: 'right',
    }).fill(global.colors.lightBlue)
    Text.draw({
      x: Document.centerX + offset, y: placeholder.titleSize,
      size: placeholder.titleSize,
      text: 'query',
      align: 'left'
    }).fill(global.colors.burple)
  },
  searchBar(t) {
    let padding = 10
    let width = placeholder.searchBarWidth
    let height = placeholder.searchBarHeight
    let x = Document.centerX - width * 0.5
    let y = placeholder.titleSize * 2 + placeholder.spacing

    searchBarResults.draw({
      x, y: y + height * 0.25,
      width: width + padding, height: height * 0.25 + padding,
      t: time,
    })
    Bar.draw({
      x: x - padding * 0.5, y: y - padding * 0.5,
      width: width + padding, height: height + padding,
    }).fill(global.colors.darkGray)
    searchBar.draw({
      x: x + width * 0.5 - padding * 0.5, y,
      width: width + padding * 2, height: height * 0.8, padding,
      t,
    })
  },
  activeTags() {
    let x = Document.centerX
    let y = placeholder.titleSize * 2 + placeholder.searchBarHeight + placeholder.spacing * 2
    let size = 20

    let row = 0
    let rowWidth = 0
    for (let tag of global.api.activeTags) {
      tag.draw({
        x: x, y: y,
        size: size
      })
      rowWidth += tag.width
    }
  },
}

let time = 0
let appLoop = async (newTime) => {
  let timeElapsed = newTime - time
  time = newTime

  UI.background()
  UI.title()
  UI.activeTags()
  UI.searchBar(time)

  Document.refreshCanvas()
  requestAnimationFrame(appLoop)
}
requestAnimationFrame(appLoop)
