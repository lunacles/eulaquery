import global from './public/global.js'
import Document from './public/document.js'

import {
  Rect,
  Text,
  Bar,
} from './public/elements.js'
import Input from './public/components/input.js'
import AutoCompleteResults from './public/components/autocomplete.js'
import Media from './public/components/media.js'
import Interpolator from './public/components/interpolation.js'
import TagContainer from './public/components/tagcontainer.js'
import SearchButton from './public/components/searchbutton.js'
import SearchResults from './public/components/searchresults.js'
import Snowfall from './public/components/snowfall.js'

import * as util from './public/utilities/util.js'

let searchBar = Input.create({ onEnter: () => {}, maxLength: 107 })
let searchBarResults = AutoCompleteResults.create({ hook: searchBar })
let searchButton = SearchButton.create({ hook: searchBar })
let searchResults = SearchResults.create()

let loadingFade = Interpolator.create({ speed: 1, sharpness: 2 })
loadingFade.set(0)
let icon = Media.image('./assets/grimheart.svg', true)

let tagContainer = TagContainer.create()
let snow = new Snowfall(50)

const UI = class {
  constructor() {
    this.spacing = 5

    this.grimheartSize = Document.height * 0.75
    this.titleSize = 75
    this.searchBarWidth = Document.width * 0.35
    this.searchBarHeight = 50

    this.tagContainerHeight = 0
  }
  get ratio() {
    return Document.width / Document.height
  }
  get vertical() {
    return Document.width / Document.height < 1
  }
  render() {
    if (Document.width / Document.height > 1) {
      // PC
      this.grimheartSize = Document.height * 0.75
      this.titleSize = 75
      this.searchBarWidth = Document.width * 0.35
      this.searchBarHeight = 50

    } else {
      // Mobile
      this.grimheartSize = Document.width
      this.titleSize = 125
      this.searchBarWidth = Document.width * 0.75
      this.searchBarHeight = 100
    }
    this.background()
    this.snowfall()
    this.grimheartIcon()
    this.radialGradient()
    this.title()
    this.activeTags()
    this.searchResults()
    this.searchBar(time)
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
      x, y: y + height * 0.25,
      width: width + padding, height: height * 0.35 + padding,
      t: time,
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
    let width = Math.min(this.searchBarWidth * 1.25, Document.width)
    let x = Document.centerX - width * 0.5
    let y = this.titleSize * 2 + this.searchBarHeight * 0.25 - 20 + this.spacing * 4 + this.tagContainerHeight
    searchResults.draw({
      x, y,
      width
    })
  }
}

const ui = new UI()

let time = 0
let appLoop = async (newTime) => {
  let timeElapsed = newTime - time
  time = newTime

  ui.render()

  Document.refreshCanvas()
  requestAnimationFrame(appLoop)
}
requestAnimationFrame(appLoop)
