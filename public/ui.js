import global from './global.js'
import Document from './document.js'
import * as util from './util.js'
import Build from './repo.js'

import {
  Rect,
  RoundRect,
  Text,
} from './elements.js'
import Media from './components/media.js'
import Interpolator from './components/interpolation.js'
import Snowfall from './components/snowfall.js'
import Keyboard from './components/keyboard.js'
import Navigator from './components/navigator.js'

import {
  mainMenu,
  mainMenuButton,
} from './menus/main.js'
import {
  contentFilterMenu,
  boxes,
} from './menus/contentfilter.js'
import {
  optionsMenu,
  toggles,
} from './menus/options.js'

//let searchResults = SearchResults.create()
let loadingFade = Interpolator.create({ speed: 1, sharpness: 2 })
loadingFade.set(0)
let icon = Media.image('./assets/grimheart.svg', true)
if (global.mobile)
  global.keyboard = Keyboard.create()
let snow = new Snowfall(global.mobile ? 25 : 50)
let navigator = Navigator.create()

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
    this.background()
    this.snowfall()
    this.grimheartIcon()
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
    this.sidebar()

  }
  background() {
    Rect.draw({
      x: 0, y: 0,
      width: Document.width, height: Document.height,
    }).fill(global.colors.bgBlack)
  }
  footer() {
    Text.draw({
      x: this.spacing, y: Document.height - 5.5,
      size: 11,
      text: 'Copyright © 2024',
      align: 'left',
    }).fill(global.colors.gray)
    Text.draw({
      x: Document.width - this.spacing, y: Document.height - 5.5,
      size: 11,
      text: `Build ${this.build.id}`,
      align: 'right',
    }).fill(global.colors.gray)
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
  sidebar() {
    contentFilterMenu.draw({
      x: 0, y: 0,
      offset: this.sidebarWidth,
      width: this.sidebarWidth, height: Document.height,
      zoneDimensions: [
        { width: 1, height: 0.05 },
        { width: 1, height: 0.0325 },
        { width: 1, height: boxes.length * 0.05 },
      ]
    })

    optionsMenu.draw({
      x: 0, y: 0,
      offset: this.sidebarWidth,
      width: this.sidebarWidth, height: Document.height,
      zoneDimensions: [
        { width: 1, height: 0.05 },
        { width: 1, height: toggles.length * 0.05 },
      ]
    })

    mainMenu.draw({
      x: 0, y: 0,
      width: this.sidebarWidth, height: Document.height,
      zoneDimensions: [
        { width: 1, height: 0.05 },
        { width: 1, height: 0.035 },
        { width: 1, height: 0.035 },
      ]
    })
    global.clickOverride.tags = mainMenuButton.state
    global.clickOverride.keyboard = mainMenuButton.state

    let size = Document.height * 0.05 * 0.85
    RoundRect.draw({
      x: this.spacing, y: this.spacing,
      width: size, height: size,
      radii: [2, 2, 2, 2],
    }).both(global.colors.burple, util.mixColors(global.colors.burple, global.colors.darkGray, 0.4), 6)
    mainMenuButton.draw({
      x: this.spacing + size * 0.25, y: this.spacing + size * 0.25,
      width: size * 0.5, height: size * 0.5,
    })
  }
  navigator(t) {
    let size = Document.height * 0.05 * 0.85

    navigator.draw({
      x: this.spacing * 2 + size, y: this.spacing,
      width: (Document.width - size) - this.spacing * 3, height: size,
      t
    })
  }
}

export default UI
