import global from '../global.js'
import Color from '../color.js'
import * as util from '../util.js'
import Storage from '../localstorage.js'

import {
  Rect,
  Line,
} from '../elements.js'
import Menu from '../components/menu.js'
import Button from '../components/button.js'
import CheckBox from '../components/checkbox.js'
import Icon from '../components/icon.js'
import TextObjects from '../textobjects.js'

let setState = (key, value) => {
  global.filter[key] = value
  Storage.filter[key].set({ value })
}
let createCheckBox = type => CheckBox.create({
  defaultState: global.filter[type],
  onCheck: state => setState(type, state),
  checkColor: Color.white,
  backgroundColor: Color.burple,
})

export let boxes = [{
  label: 'Loli',
  box: createCheckBox('loli'),
}, {
  label: 'Furry/Beastiality',
  box: createCheckBox('furry'),
}, {
  label: 'Guro',
  box: createCheckBox('guro'),
}, {
  label: 'Rape',
  box: createCheckBox('rape'),
}, {
  label: 'AI',
  box: createCheckBox('ai'),
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
  }).both(Color.blend(Color.black, Color.white, 0.025), Color.blend(Color.black, Color.white, 0.2), 4)
}).seperator((x, y, width, height) => {
  Line.draw({
    x1: x + width * 0.1, y1: y + height * 0.5,
    x2: x + width, y2: y + height * 0.5,
  }).alpha(0.5).stroke(Color.blend(Color.black, Color.white, 0.2), 2)
}).appendZone((x, y, width, height) => {
  let spacing = 5
  let size = util.fitTextToArea({
    text: 'Content Filter',
    width: width - spacing * 2,
    height: height - spacing * 2,
  })

  TextObjects.menuHeaders.contentFilter.draw({
    x: x + width - spacing, y: y + size * 1.2,
    size,
    text: 'Content Filter',
    align: 'right',
  }).fill(Color.white)
})

.appendZone((x, y, width, height) => {
  // Preset filters
  let spacing = 5
  let size = util.fitTextToArea({
    text: 'Preset Filters',
    width: width - spacing * 2,
    height: height - spacing * 2,
  })

  TextObjects.menuHeaders.presetFilters.draw({
    x: x + width - spacing, y: y + size * 1.1,
    size,
    text: 'Preset Filters',
    align: 'right',
  }).fill(Color.white)
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
    TextObjects.contentFilters[i].draw({
      x: x + width - spacing * 2 - toggleHeight * 0.5 - 5, y: y + spacing * 0.5 + spacing * i + toggleHeight * i + toggleHeight * 0.7,
      size: toggleHeight * 0.55,
      align: 'right',
      text: label
    }).fill(Color.white)
  }
})
