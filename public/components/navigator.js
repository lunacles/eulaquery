import global from '../global.js'
import Color from '../color.js'
import * as util from '../util.js'
import Document from '../document.js'

import {
  RoundRect,
  Poly,
} from '../elements.js'
import ClickRegion from './clickregion.js'
import CanvasInput from './canvasinput.js'
//import Input from './input.js'
import Icon from './icon.js'
import AutoCompleteResults from './autocomplete.js'
import SearchButton from './searchbutton.js'
import ResultContainer from './resultcontainer.js'
import TagContainer from './tagcontainer.js'
import Button from './button.js'
import AccountPage from './accountpage.js'

import {
  mainMenu,
  mainMenuButton,
  mainMenuIcon,
} from '../menus/main.js'
import {
  contentFilterMenu,
  boxes,
} from '../menus/contentfilter.js'
import {
  optionsMenu,
  toggles,
} from '../menus/options.js'

const searchBar = CanvasInput.create({ onEnter: () => {}, maxLength: 50 })
//const searchBar = Input.create({ onEnter: () => {}, maxLength: 50 })
const searchAutoComplete = AutoCompleteResults.create({ hook: searchBar })
const searchContainer = ResultContainer.create()
const searchButton = SearchButton.create({ hook: searchBar })
const tagContainer = TagContainer.create()
const accountPageButton = Button.create()
const accountPageIcon = Icon.create('account').addToggle(accountPageButton)
const accountPage = AccountPage.create(accountPageButton)

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
    }).both(Color.burple, Color.blend(Color.burple, Color.darkGray, 0.6), 6)

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
    }).fill(Color.white)

    this.clickRegion.home.update({
      x, y,
      width, height
    })
  }
  /*historyButton({ x = 0, y = 0, width = 0, height = 0 }) {
    RoundRect.draw({
      x, y,
      width, height,
      radii: [2, 2, 2, 2],
    }).both(Color.burple, Color.blend(Color.burple, Color.darkGray, 0.6), 6)

    Arc.draw({
      x: x + width * 0.5, y: y + height * 0.5,
      radius: width * 0.5 - this.spacing * 0.5,
      startAngle: Math.PI * 0.65,
      endAngle: Math.PI * 2.3
    }).stroke(Color.white, 3)
    Line.draw({
      x1: x + width * 0.35, y1: y + height * 0.9,
      x2: x + width * 0.15, y2: y + height * 0.9,
    }).stroke(Color.white, 3)
    Line.draw({
      x1: x + width * 0.35, y1: y + height * 0.85,
      x2: x + width * 0.35, y2: y + height * 0.75,
    }).stroke(Color.white, 3)


    Line.draw({
      x1: x + width * 0.5, y1: y + height * 0.35,
      x2: x + width * 0.5, y2: y + height * 0.5,
    }).stroke(Color.white, 3)
    Line.draw({
      x1: x + width * 0.5, y1: y + height * 0.5,
      x2: x + width * 0.65, y2: y + height * 0.6,
    }).stroke(Color.white, 3)

    this.clickRegion.recent.update({
      x, y,
      width, height
    })
  }*/
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
  tagContainer({ x = 0, y = 0, width = 0, height = 0, spacing = 5 }) {
    tagContainer.draw({
      x, y: y + height * 0.5,
      width, heightOffset: height * 0.5, tagSize: 15, spacing
    })
  }
  sidebar() {
    let sidebarWidth = global.mobile ? Document.width * 0.5 : Document.width * 0.15
    contentFilterMenu.draw({
      x: 0, y: 0,
      offset: sidebarWidth,
      width: sidebarWidth, height: Document.height,
      zoneDimensions: [
        { width: 1, height: 0.05 },
        { width: 1, height: 0.0325 },
        { width: 1, height: boxes.length * 0.05 },
      ]
    })

    optionsMenu.draw({
      x: 0, y: 0,
      offset: sidebarWidth,
      width: sidebarWidth, height: Document.height,
      zoneDimensions: [
        { width: 1, height: 0.05 },
        { width: 1, height: toggles.length * 0.05 },
      ]
    })

    mainMenu.draw({
      x: 0, y: 0,
      width: sidebarWidth, height: Document.height,
      zoneDimensions: [
        { width: 1, height: 0.05 },
        { width: 1, height: 0.035 },
        { width: 1, height: 0.035 },
      ]
    })
  }
  accountPage() {
    accountPage.draw({
      x: this.spacing, y: this.spacing,
      width: Document.width - this.spacing * 2, height: Document.height - this.spacing * 2 - 30,
      t: this.t
    })
  }
  draw({ x = 0, y = 0, width = 0, height = 0, t = 0 }) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.t = t

    let mainWidth = this.width - this.height * 2 - this.spacing * 2
    this.tagContainer({
      x: this.x + this.height + this.spacing, y,
      width: mainWidth, height, spacing: this.spacing
    })
    searchAutoComplete.draw({
      x: this.x + this.height + this.spacing, y: y + 25 * 0.5 + this.spacing * 1.5,
      width: mainWidth, height: 25,
    })
    searchContainer.draw({
      x: this.x * 0.5, y: this.spacing + this.height + tagContainer.height + searchAutoComplete.bottomY,
      width: Document.width,
      spacing: 7.5,
    })

    //global.keyboard.update()

    RoundRect.draw({
      x: this.x + this.height + this.spacing, y: this.y,
      width: mainWidth, height: this.height,
      radii: [2, 2, 2, 2],
    }).both(Color.burple, Color.blend(Color.burple, Color.darkGray, 0.6), 6)
    this.searchBar({
      x: this.x + this.height + this.spacing, y: this.y,
      width: mainWidth, height: this.height
    })

    let drawAccountButton = () => {
      RoundRect.draw({
        x: this.x + this.height + mainWidth + this.spacing * 2, y: this.spacing,
        width: this.height, height: this.height,
        radii: [2, 2, 2, 2],
      }).both(Color.burple, Color.blend(Color.burple, Color.darkGray, 0.6), 6)
      accountPageButton.update({
        x: this.x + this.height + mainWidth + this.spacing * 2, y: this.spacing,
        width: this.height, height: this.height,
      })
      accountPageIcon.draw({
        x: this.x + this.height * 1.25 + mainWidth + this.spacing * 2, y: this.spacing + this.height * 0.25,
        width: this.height * 0.5, height: this.height * 0.5,
      })
    }
    if (mainMenuButton.state)
      drawAccountButton()

    // Don't draw the sidebar if its closed for performance enhancements
    if (mainMenuButton.state || mainMenu.interpolator.get() < 0.99)
      this.sidebar()

    RoundRect.draw({
      x: this.spacing, y: this.spacing,
      width: this.height, height: this.height,
      radii: [2, 2, 2, 2],
    }).both(Color.burple, Color.blend(Color.burple, Color.darkGray, 0.6), 6)

    mainMenuButton.update({
      x: this.spacing, y: this.spacing,
      width: this.height, height: this.height,
    })
    mainMenuIcon.draw({
      x: this.spacing + this.height * 0.25, y: this.spacing + this.height * 0.25,
      width: this.height * 0.5, height: this.height * 0.5,
    })

    if (global.clickOverride.sidebar && mainMenuButton.state) mainMenuButton.state = false
    if (global.clickOverride.account && accountPageButton.state) accountPageButton.state = false

    // Don't draw the account page if its closed for performance enhancements
    if (accountPageButton.state/* || accountPage.interpolator.get() > 0.99 */)
      this.accountPage()

    if (!mainMenuButton.state)
      drawAccountButton()

    //if (global.keyboard.state)
      //global.keyboard.draw({ y: Document.height - 215, spacing: this.spacing - 2 })

    global.clickOverride.tags = mainMenuButton.state || accountPageButton.state
    global.clickOverride.search = mainMenuButton.state || accountPageButton.state
    global.clickOverride.keyboard = mainMenuButton.state
    global.clickOverride.account = mainMenuButton.state
    global.clickOverride.sidebar = accountPageButton.state
  }
}

export default Navigator
