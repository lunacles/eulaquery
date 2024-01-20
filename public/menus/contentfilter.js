import global from '../global.js'
import * as util from '../util.js'
import Storage from '../localstorage.js'

import {
  Rect,
  Text,
  Line,
} from '../elements.js'
import Menu from '../components/menu.js'
import Button from '../components/button.js'
import CheckBox from '../components/checkbox.js'
import Icon from '../components/icon.js'

let setState = (key, value) => {
  global.filter[key] = value
  Storage.filter[key].set({ value })
}

export let boxes = [{
  label: 'Loli',
  box: CheckBox.create(global.filter.loli, state => setState('loli', state))
}, {
  label: 'Furry/Beastiality',
  box: CheckBox.create(global.filter.furry, state => setState('furry', state))
}, {
  label: 'Guro',
  box: CheckBox.create(global.filter.guro, state => setState('guro', state))
}, {
  label: 'Rape',
  box: CheckBox.create(global.filter.rape, state => setState('rape', state))
}, {
  label: 'AI',
  box: CheckBox.create(global.filter.ai, state => setState('ai', state))
}]

export const contentFilterButton = Button.create()
export const contentFilterIcon = Icon.create('arrow').addToggle(contentFilterButton)
export const contentFilterMenu = Menu.create({
  button: contentFilterButton,
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
    text: 'Content Filter',
    width: width - spacing * 2,
    height: height - spacing * 2,
  })

  Text.draw({
    x: x + width - spacing, y: y + size * 1.2,
    size,
    text: 'Content Filter',
    align: 'right',
  }).fill(global.colors.white)
})

.appendZone((x, y, width, height) => {
  // Preset filters
  let spacing = 5
  let size = util.fitTextToArea({
    text: 'Preset Filters',
    width: width - spacing * 2,
    height: height - spacing * 2,
  })

  Text.draw({
    x: x + width - spacing, y: y + size * 1.1,
    size,
    text: 'Preset Filters',
    align: 'right',
  }).fill(global.colors.white)
})

// Content Filter
.appendZone((x, y, width, height) => {
  let spacing = 15
  let toggleHeight = height / boxes.length - spacing
  for (let [i, { label, box }] of boxes.entries()) {
    box.draw({
      x: x + width - spacing - toggleHeight * 0.5 - 5, y: y + spacing * 0.5 + spacing * i + toggleHeight * i,
      width: toggleHeight, height: toggleHeight,
    })
    Text.draw({
      x: x + width - spacing * 2 - toggleHeight * 0.5 - 5, y: y + spacing * 0.5 + spacing * i + toggleHeight * i + toggleHeight * 0.7,
      size: toggleHeight * 0.55,
      align: 'right',
      text: label
    }).fill(global.colors.white)
  }
})
