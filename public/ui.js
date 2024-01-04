import global from './global.js'
import Document from './document.js'
import * as util from './util.js'
import Storage from './localstorage.js'

Storage.verifyIntegrity()
Storage.restore()

import {
  Rect,
  RoundRect,
} from './elements.js'
import Input from './components/input.js'
import AutoCompleteResults from './components/autocomplete.js'
import Media from './components/media.js'
import Interpolator from './components/interpolation.js'
import TagContainer from './components/tagcontainer.js'
import SearchButton from './components/searchbutton.js'
import SearchResults from './components/searchresults.js'
import Snowfall from './components/snowfall.js'
import Keyboard from './components/keyboard.js'

import {
  MainMenu,
  MainMenuButton,
} from './menus/main.js'
import {
  ContentFilterMenu,
  ContentFilterButton,
  boxes,
} from './menus/contentfilter.js'
import {
  OptionsMenu,
  OptionsButton,
  toggles,
} from './menus/options.js'


let searchBar = Input.create({ onEnter: () => {}, maxLength: 50 })
let searchBarResults = AutoCompleteResults.create({ hook: searchBar })
let searchButton = SearchButton.create({ hook: searchBar })
let searchResults = SearchResults.create()
let loadingFade = Interpolator.create({ speed: 1, sharpness: 2 })
loadingFade.set(0)
let icon = Media.image('./assets/grimheart.svg', true)
let tagContainer = TagContainer.create()
global.keyboard = Keyboard.create()
let snow = new Snowfall(global.mobile ? 25 : 50)

const UI = class {
  constructor() {
    this.spacing = 5

    this.grimheartSize = Document.height * 0.75
    this.titleSize = 75
    this.searchBarWidth = Document.width * 0.35
    this.searchBarHeight = 50
    this.autoCompleteHeight = 0

    this.tagContainerHeight = 0

    this.maxRowLength = 5

    this.sidebarWidth = Document.width * 0.2
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
      this.sidebarWidth = Document.width * 0.2
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
    /*
    this.title()
    this.activeTags()
    this.searchResults()
    */

    global.keyboard.draw({ y: Document.height - 225, spacing: this.spacing })
    //this.searchBar(time)
    this.sidebar()
  }
  background() {
    Rect.draw({
      x: 0, y: 0,
      width: Document.width, height: Document.height,
    }).fill(global.colors.bgBlack)
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
  /*
  title() {
    let eulaWidth = util.measureText('Eula', this.titleSize).width * 2
    let queryWidth = util.measureText('query', this.titleSize).width * 2
    let offset = (eulaWidth - queryWidth) * 0.25
    Text.draw({
      x: Document.centerX + offset, y: this.titleSize,
      size: this.titleSize,
      text: 'Eula',
      align: 'right',
    }).fill(global.colors.lightBlue)
    Text.draw({
      x: Document.centerX + offset, y: this.titleSize,
      size: this.titleSize,
      text: 'query',
      align: 'left'
    }).fill(global.colors.burple)
  }
  searchBar(t) {
    let padding = 10
    let width = this.searchBarWidth
    let height = this.searchBarHeight
    let x = Document.centerX - width * 0.5
    let y = this.titleSize * 2 + this.spacing

    searchBarResults.draw({
      x, y: y + height * 0.15,
      width: width + padding, height: this.autoCompleteHeight + padding,
    })
    Bar.draw({
      x: x - padding * 0.5, y: y - padding * 0.5,
      width: width + padding, height: height + padding,
    }).fill(global.colors.darkGray)
    searchBar.draw({
      x: x + width * 0.5 * 0.9 - padding * 0.5, y,
      width: width * 0.9 + padding * 2, height: height * 0.8, padding,
      t,
    })

    searchButton.draw({
      x: Document.centerX + width * 0.5, y,
      radius: this.vertical ? height * 0.9 : height,
      offset: padding,
    })
  }
  activeTags() {
    let x = Document.centerX - (this.searchBarWidth + this.searchBarHeight + 20) * 0.5
    let y = this.titleSize * 2 + this.searchBarHeight * 0.25 - 20 + this.spacing

    this.tagContainerHeight = tagContainer.draw({
      x, y,
      width: this.searchBarWidth + this.searchBarHeight + 20, heightOffset: this.searchBarHeight * 0.25 + 20,
      tagSize: this.searchBarHeight * 0.4,
      spacing: 10,
    })
  }
  searchResults() {
    let width = Document.width
    let x = 0
    let y = this.titleSize * 2 + this.searchBarHeight * 0.25 - 20 + this.spacing * 4 + this.tagContainerHeight
    searchResults.draw({
      x, y,
      width,
      spacing: 10, maxRowLength: this.maxRowLength
    })
  }
  */
  sidebar() {
    ContentFilterMenu.draw({
      x: 0, y: 0,
      offset: this.sidebarWidth,
      width: this.sidebarWidth, height: Document.height,
      zoneDimensions: [
        { width: 1, height: 0.05 },
        { width: 1, height: boxes.length * 0.045 },
      ]
    })

    OptionsMenu.draw({
      x: 0, y: 0,
      offset: this.sidebarWidth,
      width: this.sidebarWidth, height: Document.height,
      zoneDimensions: [
        { width: 1, height: 0.05 },
        { width: 1, height: toggles.length * 0.045 },
      ]
    })

    MainMenu.draw({
      x: 0, y: 0,
      width: this.sidebarWidth, height: Document.height,
      zoneDimensions: [
        { width: 1, height: 0.05 },
        { width: 1, height: 0.035 },
        { width: 1, height: 0.035 },
      ]
    })
    if (!MainMenuButton.state) {
      ContentFilterButton.state = false
      OptionsButton.state = false
    }

    let size = Document.height * 0.05 * 0.85
    RoundRect.draw({
      x: this.spacing * 1.5, y: this.spacing * 1.5,
      width: size, height: size,
    }).both(global.colors.burple, util.mixColors(global.colors.burple, global.colors.darkGray, 0.4), 6)
    MainMenuButton.draw({
      x: size * 0.25 + this.spacing * 1.5, y: size * 0.25 + this.spacing * 1.5,
      width: size * 0.5, height: size * 0.5,
    })
  }
}

export default UI
