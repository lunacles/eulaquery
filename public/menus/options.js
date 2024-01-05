import global from '../global.js'
import * as util from '../util.js'
import Storage from '../localstorage.js'

import {
  Rect,
  Text,
  Line,
} from '../elements.js'
import Menu from '../components/menu.js'
import Toggle from '../components/toggle.js'
import MenuButton from '../components/menubutton.js'

export let toggles = [{
  label: 'Save Session Tags',
  toggle: Toggle.create(global.options.saveTags, state => {
    global.options.saveTags = state
    Storage.options.saveTags.set({ value: state })
  })
}, {
  label: 'Snow Fall',
  toggle: Toggle.create(global.ui.snowFall, state => {
    global.ui.snowFall = state
    Storage.ui.snowFall.set({ value: state })
  })
}]

export const OptionsButton = MenuButton.create('arrow')
export const OptionsMenu = Menu.create({
  button: OptionsButton,
  elementSpacing: 15,
}).background((x, y, width, height) => {
  Rect.draw({
    x, y,
    width, height
  }).both(util.mixColors(global.colors.black, global.colors.white, 0.025), util.mixColors(global.colors.black, global.colors.white, 0.2), 4)
}).seperator((x, y, width, height) => {
  Line.draw({
    x1: x + width * 0.1, y1: y + height * 0.5,
    x2: x + width, y2: y + height * 0.5,
  }).alpha(0.5).stroke(util.mixColors(global.colors.black, global.colors.white, 0.2), 2)
}).appendZone((x, y, width, height) => {
  let spacing = 5
  let size = util.fitTextToArea({
    text: 'Options',
    width: width - spacing * 2,
    height: height - spacing * 2,
  })

  Text.draw({
    x: x + width - spacing, y: y + size * 1.1,
    size,
    text: 'Options',
    align: 'right ',
  }).fill(global.colors.white)
})
  // Options
.appendZone((x, y, width, height) => {
  let spacing = 15
  let toggleWidth = width * 0.1
  let toggleHeight = height / toggles.length - spacing

  for (let [i, { label, toggle }] of toggles.entries()) {
    toggle.draw({
      x: x + width - spacing - toggleWidth - 5, y: y - spacing * 0.25 + spacing * i + toggleHeight * (i + 1),
      width: toggleWidth, height: toggleHeight,
    })
    Text.draw({
      x: x + width - spacing * 2.5 - toggleWidth - 5, y: y + spacing * i + toggleHeight * (i + 1),
      size: toggleHeight * 0.5,
      align: 'right',
      text: label
    }).fill(global.colors.white)
  }
})
