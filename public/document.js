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
  refreshCanvas() {
    c.setSize({ width: window.innerWidth, height: window.innerHeight, scale: window.devicePixelRatio })
    c.setViewport({ x: 0, y: 0, width: c.width, height: c.height })

    mouse.left = false
    mouse.right = false
    mouse.doubleClick = false
    mouse.scroll += (mouse.targetScroll - mouse.scroll) * 0.1
    mouse.targetScroll -= mouse.targetScroll / 10
    keyboard.e = null
  },
}

export default Document
