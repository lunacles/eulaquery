import Canvas from './canvas.js'
const canvas = document.getElementById('canvas')
const c = new Canvas(canvas)

import global from './global.js'
import Interaction from './interaction.js'

Interaction.settings.get('mouse').set('preventDefault', true)
Interaction.settings.get('mouse').set('dispatchAfterRelease', true)
Interaction.settings.get('mouse').set('scrollSpeed', 15)

if (!global.mobile) {
  Interaction.editEvent('mousedown').bind('default')
  Interaction.editEvent('mouseup').bind('default')
  Interaction.editEvent('mousemove').bind('default')
  Interaction.editEvent('wheel').bind('default')
  Interaction.editEvent('contextmenu').bind('default')
} else {
  Interaction.editEvent('touchstart').bind('default')
  Interaction.editEvent('touchcancel').bind('default')
  Interaction.editEvent('touchend').bind('default')
  Interaction.editEvent('touchmove').bind('default')
}
Interaction.editEvent('keydown').bind('default')

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
    if (Interaction.mouse.leftHeld && !Interaction.mouse.moving) {
      Document.holdTime++
      if (Document.holdTime > 30) {
        Interaction.mouse.scroll = 0
        Interaction.mouse.targetScroll = 0
      }
    } else {
      Document.holdTime = 0
    }

    if (Document.holdTime <= 30) {
      let smoothFix = Interaction.mouse.leftHeld ? 1 : 0.075 * (timeDelta / 16.67)
      Interaction.mouse.scroll += (Interaction.mouse.targetScroll - Interaction.mouse.scroll) * smoothFix
      Interaction.mouse.targetScroll -= Interaction.mouse.targetScroll * smoothFix
    }

    Interaction.reset()
    // Make it so smaller images dont get upscaled if they are lower than this
  },
}

export default Document
