import global from '../global.js'
import * as util from '../util.js'
import Document from '../document.js'

import {
  RoundRect,
  Text,
  Poly,
  Arc,
  Line,
} from '../elements.js'
import ClickRegion from './clickregion.js'
import Input from './input.js'
import AutoCompleteResults from './autocomplete.js'
import SearchButton from './searchbutton.js'
import SearchResults from './searchresults.js'
import TagContainer from './tagcontainer.js'

const searchBar = Input.create({ onEnter: () => {}, maxLength: 50 })
const searchAutoComplete = AutoCompleteResults.create({ hook: searchBar })
const searchButton = SearchButton.create({ hook: searchBar })
const searchResults = SearchResults.create()
const tagContainer = TagContainer.create()

const Navigator = class {
  static create() {
    return new Navigator()
  }
  constructor() {
    this.x = 0
    this.y = 0
    this.width = 0
    this.height = 0
    this.spacing = 7.5
    this.t = 0

    this.maxRowLength = global.mobile ? 2 : 5

    this.clickRegion = {
      home: ClickRegion.create(),
      recent: ClickRegion.create(),
      history: ClickRegion.create(),
    }
  }
  homeButton({ x = 0, y = 0, width = 0, height = 0 }) {
    RoundRect.draw({
      x, y,
      width, height,
      radii: [2, 2, 2, 2],
    }).both(global.colors.burple, util.mixColors(global.colors.burple, global.colors.darkGray, 0.4), 6)

    let poly = {
      x: x + this.spacing * 0.5,
      y: y + this.spacing * 0.5,
      w: width - this.spacing,
      h: height - this.spacing,
    }
    Poly.draw({
      x: x + this.spacing * 0.5, y: y + this.spacing * 0.5,
      width: width - this.spacing, height: height - this.spacing,
      path: [
        [poly.x + poly.w * 0.5, poly.y],
        [poly.x, poly.y + poly.h * 0.65],
        [poly.x + poly.w * 0.1, poly.y + poly.h * 0.65],
        [poly.x + poly.w * 0.1, poly.y + poly.h],
        [poly.x + poly.w * 0.35, poly.y + poly.h],
        [poly.x + poly.w * 0.35, poly.y + poly.h * 0.65],
        [poly.x + poly.w * 0.65, poly.y + poly.h * 0.65],
        [poly.x + poly.w * 0.65, poly.y + poly.h],
        [poly.x + poly.w * 0.9, poly.y + poly.h],
        [poly.x + poly.w * 0.9, poly.y + poly.h * 0.65],
        [poly.x + poly.w, poly.y + poly.h * 0.65],
        [poly.x + poly.w * 0.5, poly.y]
      ]
    }).fill(global.colors.white)

    this.clickRegion.home.update({
      x, y,
      width, height
    })
  }
  historyButton({ x = 0, y = 0, width = 0, height = 0 }) {
    RoundRect.draw({
      x, y,
      width, height,
      radii: [2, 2, 2, 2],
    }).both(global.colors.burple, util.mixColors(global.colors.burple, global.colors.darkGray, 0.4), 6)

    Arc.draw({
      x: x + width * 0.5, y: y + height * 0.5,
      radius: width * 0.5 - this.spacing * 0.5,
      startAngle: Math.PI * 0.65,
      endAngle: Math.PI * 2.3
    }).stroke(global.colors.white, 3)
    Line.draw({
      x1: x + width * 0.35, y1: y + height * 0.9,
      x2: x + width * 0.15, y2: y + height * 0.9,
    }).stroke(global.colors.white, 3)
    Line.draw({
      x1: x + width * 0.35, y1: y + height * 0.85,
      x2: x + width * 0.35, y2: y + height * 0.75,
    }).stroke(global.colors.white, 3)


    Line.draw({
      x1: x + width * 0.5, y1: y + height * 0.35,
      x2: x + width * 0.5, y2: y + height * 0.5,
    }).stroke(global.colors.white, 3)
    Line.draw({
      x1: x + width * 0.5, y1: y + height * 0.5,
      x2: x + width * 0.65, y2: y + height * 0.6,
    }).stroke(global.colors.white, 3)

    this.clickRegion.recent.update({
      x, y,
      width, height
    })
  }
  searchBar({ x = 0, y = 0, width = 0, height = 0 }) {
    searchBar.draw({
      x: x + width * 0.5 - height * 0.5, y: y + height * 0.5,
      width: width - this.spacing - height, height: height - this.spacing,
      t: this.t,
    })
    searchButton.draw({
      x: x + width - height * 0.5, y: y + height * 0.5,
      radius: height,
      offset: 10,
    })
  }
  tagContainer({ x = 0, y = 0, width = 0, height = 0 }) {
    tagContainer.draw({
      x, y: y + height * 0.5,
      width, heightOffset: height * 0.5, tagSize: 15, spacing: 5
    })
  }
  draw({ x = 0, y = 0, width = 0, height = 0, t = 0 }) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.t = t

    let mainWidth = this.width - this.height - this.spacing
    this.tagContainer({
      x, y,
      width: mainWidth, height
    })
    searchAutoComplete.draw({
      x, y: y + 25 * 0.5 + this.spacing * 1.5,
      width: mainWidth, height: 25,
    })
    searchResults.draw({
      x: this.spacing * 0.5, y: this.spacing + this.height + tagContainer.height + searchAutoComplete.bottomY,
      width: Document.width - this.spacing,
      spacing: 7.5, maxRowLength: this.maxRowLength
    })
    RoundRect.draw({
      x: this.x, y: this.y,
      width: mainWidth, height: this.height,
      radii: [2, 2, 2, 2],
    }).both(global.colors.burple, util.mixColors(global.colors.burple, global.colors.darkGray, 0.4), 6)
    this.searchBar({
      x: this.x, y: this.y,
      width: mainWidth, height: this.height
    })

    /*
    Text.draw({
      x: this.x + this.spacing * 0.5, y: this.y + this.height * 0.75,
      size: this.height * 0.75,
      align: 'left',
      text: this.state,
    }).fill(global.colors.white)
    */

    /*
    this.homeButton({
      x: this.x + mainWidth + this.spacing, y: this.y,
      width: this.height, height: this.height,
    })
    */
    this.historyButton({
      x: this.x + mainWidth + this.spacing/* * 2 + this.height */, y: this.y,
      width: this.height, height: this.height,
    })
  }
}

export default Navigator
