import global from './global.js'
import Document from './document.js'
import * as util from './util.js'
import Build from './repo.js'

import {
  Rect,
  Text,
} from './elements.js'
import Media from './components/media.js'
import Interpolator from './components/interpolation.js'
import Snowfall from './components/snowfall.js'
import Keyboard from './components/keyboard.js'
import Navigator from './components/navigator.js'

//let searchResults = SearchResults.create()
const loadingFade = Interpolator.create({ speed: 1, sharpness: 2 })
loadingFade.forceDisplay(0)
const icon = Media.image('./assets/grimheart.svg', true)
if (global.mobile)
  global.keyboard = Keyboard.create()
const snow = new Snowfall(global.mobile ? 25 : 50)
const navigator = Navigator.create()

const loadInFade = Interpolator.create({ speed: 0.15, sharpness: 1 })
loadInFade.forceDisplay(1)

const UI = class {
  constructor() {
    this.spacing = 7.5

    this.grimheartSize = Document.height * 0.75
    this.titleSize = 75
    this.searchBarWidth = Document.width * 0.35
    this.searchBarHeight = 50
    this.autoCompleteHeight = 0

    this.tagContainerHeight = 0

    this.maxRowLength = 5

    this.sidebarWidth = Document.width * 0.15

    this.build = Build
  }
  get ratio() {
    return Document.width / Document.height
  }
  get vertical() {
    return Document.width / Document.height < 1
  }
  render(time) {
    if (Document.width / Document.height > 1) {
      // PC
      this.grimheartSize = Document.height * 0.75
      this.titleSize = 75
      this.searchBarWidth = Document.width * 0.35
      this.searchBarHeight = 50
      this.maxRowLength = 5
      this.autoCompleteHeight = this.searchBarHeight * 0.35
      this.sidebarWidth = Document.width * 0.15
    } else {
      // Mobile
      this.grimheartSize = Document.width
      this.titleSize = 50
      this.searchBarWidth = Document.width * 0.65
      this.searchBarHeight = 50
      this.maxRowLength = 2
      this.autoCompleteHeight = this.searchBarHeight * 0.2
      this.sidebarWidth = Document.width * 0.5
    }
    this.background().fill(global.colors.bgBlack)
    // Only draw the snowfall and search results if there isn't any search queries for performance enhancements
    if (!global.api.results?.posts.length > 0) {
      this.snowfall()
      this.grimheartIcon()
    }
    this.radialGradient()
    this.footer()
    if (global.mobile) {
      this.navigator(time)
    } else {
      let size = util.fitTextToArea({
        text: 'The PC client of this website has not begun construction!',
        width: Document.width - this.spacing * 2, height: Document.height
      })
      Text.draw({
        x: Document.centerX, y: Document.centerY,
        size,
        align: 'center',
        text: 'The PC client of this website has not begun construction!'
      }).fill(global.colors.white)
      Text.draw({
        x: Document.centerX, y: Document.centerY + size + this.spacing,
        size,
        align: 'center',
        text: 'The mobile client is partially complete though!'
      }).fill(global.colors.white)
    }

    loadInFade.set(0)
    if (loadInFade.get() >= 0.001)
      this.loadingScreen()
  }
  loadingScreen() {
    this.background().alpha(loadInFade.get()).fill(global.colors.bgBlack)
    Text.draw({
      x: Document.centerX, y: Document.centerY,
      size: 20,
      align: 'center',
      text: 'Connecting to server...',
      family: '"Trebuchet MS", sans-serif',
    }).alpha(loadInFade.get()).fill(global.colors.white)
  }
  background() {
    return Rect.draw({
      x: 0, y: 0,
      width: Document.width, height: Document.height,
    })
  }
  snowfall() {
    snow.draw()
  }
  grimheartIcon() {
    if (icon.loaded) {
      loadingFade.set(1)

      icon.alpha(Math.max(0, loadingFade.get() - 0.3)).draw({
        x: Document.centerX - this.grimheartSize * 0.5, y: Document.centerY - this.grimheartSize * 0.375,
        width: this.grimheartSize, height: this.grimheartSize
      })
    }
  }
  radialGradient() {
    Rect.draw({
      x: 0, y: 0,
      width: Document.width * 2, height: Document.height * 2,
    }).alpha(0.98).fillRadialGradient({
      x1: Document.centerX, y1: Document.height * 1.75, r1: Document.height * 3,
      x2: Document.centerX, y2: Document.height * 2, r2: 0,
      gradient: [{ color: global.colors.bgBlack, pos: 0.5, }, { color: util.mixColors(global.colors.white, global.colors.navyBlue, 0.99), pos: 1 }]
    })
  }
  footer() {
    Text.draw({
      x: this.spacing, y: Document.height - this.spacing,
      size: 11,
      text: 'Copyright © 2024',
      align: 'left',
    }).fill(global.colors.gray)
    Text.draw({
      x: this.spacing, y: Document.height - this.spacing - 15,
      size: 11,
      text: 'damocles',
      align: 'left',
    }).fill(global.colors.gray)
    Text.draw({
      x: Document.width - this.spacing, y: Document.height - this.spacing - 15,
      size: 11,
      text: `Build ${this.build.id}`,
      align: 'right',
    }).fill(global.colors.gray)
    Text.draw({
      x: Document.width - this.spacing, y: Document.height - this.spacing,
      size: 11,
      text: `Server ${global.server.id}`,
      align: 'right',
    }).fill(global.colors.gray)
  }
  navigator(t) {
    navigator.draw({
      x: this.spacing, y: this.spacing,
      width: Document.width - this.spacing * 2, height: Document.height * 0.05 * 0.85,
      t
    })
  }
}

export default UI
