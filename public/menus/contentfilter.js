import global from '../global.js'
import * as util from '../util.js'

import {
  Rect,
  Text,
  Line,
} from '../elements.js'
import Menu from '../components/menu.js'
import MenuButton from '../components/menubutton.js'
import CheckBox from '../components/checkbox.js'

export let boxes = [{
  label: 'Placeholder',
  box: CheckBox.create(global.options.contentFilter, state => {
    global.options.contentFilter = state
  })
}, {
  label: 'Placeholder',
  box: CheckBox.create(global.options.a, state => {
    global.options.a = state
  })
}, {
  label: 'Placeholder',
  box: CheckBox.create(global.options.a, state => {
    global.options.a = state
  })
}, {
  label: 'Placeholder',
  box: CheckBox.create(global.options.a, state => {
    global.options.a = state
  })
}]

export const ContentFilterButton = MenuButton.create('arrow')
export const ContentFilterMenu = Menu.create({
  button: ContentFilterButton,
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
    x: x + spacing, y: y + size * 1.1,
    size,
    text: 'Content Filter',
    align: 'left',
  }).fill(global.colors.white)
})
// Content Filter
.appendZone((x, y, width, height) => {
  let spacing = 15
  let toggleHeight = height / boxes.length - spacing
  for (let [i, { label, box }] of boxes.entries()) {
    box.draw({
      x: x + spacing, y: y + spacing * 0.5 + spacing * i + toggleHeight * i,
      width: toggleHeight, height: toggleHeight,
    })
    Text.draw({
      x: x + toggleHeight + spacing * 2, y: y + spacing * 0.5 + spacing * i + toggleHeight * i + toggleHeight * 0.7,
      size: toggleHeight * 0.5,
      align: 'left',
      text: label
    }).fill(global.colors.white)
  }
})
