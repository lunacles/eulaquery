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
import Snowfall from './public/components/snowfall.js'

import global from './public/global.js'
import Document from './public/document.js'

import * as util from './public/utilities/util.js'

let searchBar = Input.create({ onEnter: () => {}, maxLength: 107 })
let searchBarResults = AutoCompleteResults.create({ hook: searchBar })

let loadingFade = Interpolator.create({ speed: 1, sharpness: 2 })
loadingFade.set(0)
let icon = Media.image('./grimheart.svg')

let tagContainer = TagContainer.create(20)

let snow = new Snowfall(50)

const placeholder = {
  spacing: 5,
  titleSize: 75,
  searchBarWidth: 400,
  searchBarHeight: 50,
}

const UI = {
  background() {
    Rect.draw({
      x: 0, y: 0,
      width: Document.width * 2, height: Document.height * 2,
    }).fill(global.colors.bgBlack)
  },
  snowfall() {
    snow.draw()
  },
  grimheartIcon() {
    if (icon.loaded) {
      loadingFade.set(1)
      let size = Document.height * 0.75
      if (Document.width < Document.height)
        size = Document.width

      icon.alpha(Math.max(0, loadingFade.get() - 0.3)).draw({
        x: Document.centerX - size * 0.5, y: Document.centerY - size * 0.375,
        width: size, height: size
      })
    }
  },
  radialGradient() {
    Rect.draw({
      x: 0, y: 0,
      width: Document.width * 2, height: Document.height * 2,
    }).alpha(0.98).fillRadialGradient({
      x1: Document.centerX, y1: Document.height * 1.75, r1: Document.height * 3,
      x2: Document.centerX, y2: Document.height * 2, r2: 0,
      gradient: [{ color: global.colors.bgBlack, pos: 0.5, }, { color: util.mixColors(global.colors.white, global.colors.navyBlue, 0.99), pos: 1 }]
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
    let x = Document.centerX - (placeholder.searchBarWidth + placeholder.searchBarHeight + 20) * 0.5
    let y = placeholder.titleSize * 2 + placeholder.searchBarHeight * 0.25 - 20 + placeholder.spacing

    tagContainer.draw({
      x, y,
      width: placeholder.searchBarWidth + placeholder.searchBarHeight + 20, heightOffset: placeholder.searchBarHeight * 0.25 + 20,
      spacing: 10,
    })
  },
}

let time = 0
let appLoop = async (newTime) => {
  let timeElapsed = newTime - time
  time = newTime

  UI.background()
  UI.snowfall()
  UI.grimheartIcon()
  UI.radialGradient()
  UI.title()
  UI.activeTags()
  UI.searchBar(time)

  Document.refreshCanvas()
  requestAnimationFrame(appLoop)
}
requestAnimationFrame(appLoop)
