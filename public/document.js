import Canvas from './canvas.js'
const canvas = document.getElementById('canvas')
const c = new Canvas(canvas)

import { mouse, keyboard } from './event.js'

const Document = {
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
  get ratio() {
    return window.devicePixelRatio
  },
  canvas: c,
  holdTime: 0,
  refreshCanvas(timeDelta) {
    c.setSize({ width: window.innerWidth, height: window.innerHeight, scale: window.devicePixelRatio })
    c.setViewport({ x: 0, y: 0, width: c.width, height: c.height })

    // TODO: rewrite this in a better way. I felt lazy and cut corners
    if (mouse.held && !mouse.moving) {
      Document.holdTime++
      if (Document.holdTime > 30) {
        mouse.scroll = 0
        mouse.targetScroll = 0
      }
    } else {
      Document.holdTime = 0
    }

    if (Document.holdTime <= 30) {
      let smoothFix = mouse.held ? 1 : 0.075 * (timeDelta / 16.67)
      mouse.scroll += (mouse.targetScroll - mouse.scroll) * smoothFix
      mouse.targetScroll -= mouse.targetScroll * smoothFix
    }

    mouse.left = false
    mouse.right = false
    mouse.doubleClick = false
    mouse.moving = false
    keyboard.e = null
  },
}

export default Document
