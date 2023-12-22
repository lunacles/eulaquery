import { Element } from './elements.js'

import { mouse, keyboard } from './utilities/event.js'

const Document = {
  // TODO improve how this is done lol
  e: new Element(),
  get width() {
    return window.innerWidth
  },
  get height() {
    return window.innerHeight
  },
  get centerX() {
    return Document.width * 0.5
  },
  get centerY() {
    return Document.height * 0.5
  },
  refreshCanvas() {
    this.e.resize({ width: window.innerWidth, height: window.innerHeight, scale: 1 })

    mouse.left = false
    mouse.right = false
    mouse.doubleClick = false
    keyboard.e = null
  },
}

export default Document
