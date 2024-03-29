import Color from '../color.js'
import Document from '../document.js'
import * as util from '../util.js'
import TextObjects from '../textobjects.js'

import {
  Rect,
  Line,
} from '../elements.js'
import Menu from '../components/menu.js'
import Button from '../components/button.js'
import Icon from '../components/icon.js'

import {
  contentFilterButton,
  contentFilterMenu,
  contentFilterIcon,
} from './contentfilter.js'
import {
  optionsButton,
  optionsMenu,
  optionsIcon,
} from './options.js'

export const mainMenuButton = Button.create()
export const mainMenuIcon = Icon.create('hamburger').addToggle(mainMenuButton)
export const mainMenu = Menu.create({
  button: mainMenuButton,
  elementSpacing: 15,
}).background((x, y, width, height) => {
  Rect.draw({
    x, y,
    width, height
  }).both(Color.black, Color.blend(Color.black, Color.white, 0.2), 4)
}).seperator((x, y, width, height) => {
  Line.draw({
    x1: x, y1: y + height * 0.5,
    x2: x + width * 0.9, y2: y + height * 0.5,
  }).alpha(0.5).stroke(Color.blend(Color.black, Color.white, 0.2), 2)
})

// Title
.appendZone((x, y, width, height) => {
  let spacing = 5
  let offset = Document.height * 0.05 * 0.85 + spacing * 2.5
  let size = util.fitTextToArea({
    text: 'Eulaquery',
    width: width - offset - spacing,
    height: height - spacing * 2,
  })

  TextObjects.headers.eulaquery[0].draw({
    x: x + offset, y: y + size * 1.1,
    size: size,
    text: 'Eula',
    align: 'left',
  }).fill(Color.lightBlue)

  let eulaTextWidth = util.measureText('Eula', size).width
  TextObjects.headers.eulaquery[1].draw({
    x: x + offset + eulaTextWidth, y: y + size * 1.1,
    size: size,
    text: 'query',
    align: 'left'
  }).fill(Color.burple)
})

// Content Filter Header
.appendZone((x, y, width, height) => {
  let spacing = 5
  let size = util.fitTextToArea({
    text: 'Content Filter',
    width: width - spacing,
    height: height - spacing * 2,
  })

  TextObjects.headers.contentFilter.draw({
    x: x + spacing, y: y + size * 1.1,
    size,
    text: 'Content Filter',
    align: 'left',
  }).fill(Color.white)

  contentFilterButton.update({
    x, y: y - spacing,
    width: width, height: height + spacing * 2,
  })
  contentFilterIcon.draw({
    x: x + width - spacing - size, y: y + spacing,
    width: size, height: size,
  })
  if (contentFilterButton.state) {
    optionsButton.state = false
  }
})
// Options Header
.appendZone((x, y, width, height) => {
  let spacing = 5
  let size = util.fitTextToArea({
    text: 'Options',
    width: width - spacing,
    height: height - spacing * 2,
  })

  TextObjects.headers.options.draw({
    x: x + spacing, y: y + size * 1.1,
    size,
    text: 'Options',
    align: 'left',
  }).fill(Color.white)

  optionsButton.update({
    x, y: y - spacing,
    width: width, height: height + spacing * 2,
  })
  optionsIcon.draw({
    x: x + width - spacing - size, y: y + spacing,
    width: size, height: size,
  })
  if (optionsButton.state) {
    contentFilterButton.state = false
  }
})

mainMenu.children = [
  contentFilterMenu,
  optionsMenu,
]
contentFilterMenu.parent = mainMenu
optionsMenu.parent = mainMenu
