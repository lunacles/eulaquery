import global from '../global.js'
import Color from '../color.js'
import * as util from '../util.js'
import Storage from '../localstorage.js'
import TextObjects from '../textobjects.js'

import {
  Rect,
  Line,
} from '../elements.js'
import Menu from '../components/menu.js'
import Toggle from '../components/toggle.js'
import Button from '../components/button.js'
import Icon from '../components/icon.js'

export let toggles = [{
  label: 'Save Session Tags',
  toggle: Toggle.create({
    defaultState: global.options.saveTags,
    onToggle: state => {
      global.options.saveTags = state
      Storage.options.saveTags.set({ value: state })
    },
    sliderColor: Color.white,
    activeColor: Color.burple,
    inactiveColor: Color.white,
  })
}, {
  label: 'Snow Fall',
  toggle: Toggle.create({
    defaultState: global.ui.snowFall,
    onToggle: state => {
      global.ui.snowFall = state
      Storage.ui.snowFall.set({ value: state })
    },
    sliderColor: Color.white,
    activeColor: Color.burple,
    inactiveColor: Color.white,
  })
}]

export const optionsButton = Button.create()
export const optionsIcon = Icon.create('arrow').addToggle(optionsButton)
export const optionsMenu = Menu.create({
  button: optionsButton,
  elementSpacing: 15,
}).background((x, y, width, height) => {
  Rect.draw({
    x, y,
    width, height
  }).both(Color.blend(Color.black, Color.white, 0.025), Color.blend(Color.black, Color.white, 0.2), 4)
}).seperator((x, y, width, height) => {
  Line.draw({
    x1: x + width * 0.1, y1: y + height * 0.5,
    x2: x + width, y2: y + height * 0.5,
  }).alpha(0.5).stroke(Color.blend(Color.black, Color.white, 0.2), 2)
}).appendZone((x, y, width, height) => {
  let spacing = 5
  let size = util.fitTextToArea({
    text: 'Options',
    width: width - spacing * 2,
    height: height - spacing * 2,
  })

  TextObjects.menuHeaders.options.draw({
    x: x + width - spacing, y: y + size * 1.1,
    size,
    text: 'Options',
    align: 'right',
  }).fill(Color.white)
})
  // Options
.appendZone((x, y, width, height) => {
  let spacing = 15
  let toggleWidth = width * 0.075
  let toggleHeight = height / toggles.length - spacing

  for (let [i, { label, toggle }] of toggles.entries()) {
    toggle.draw({
      x: x + width - spacing - toggleWidth - 5, y: y - spacing * 0.25 + spacing * i + toggleHeight * (i + 0.5),
      width: toggleWidth, height: toggleHeight,
    })
    TextObjects.options[i].draw({
      x: x + width - spacing * 2.5 - toggleWidth - 5, y: y + spacing * i + toggleHeight * (i + 1),
      size: toggleHeight * 0.5,
      align: 'right',
      text: label
    }).fill(Color.white)
  }
})
