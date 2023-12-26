import global from '../global.js'

export let mouse = {
  x: 0,
  y: 0,
  left: false,
  right: false,
  held: false,
  doubleClick: false,
  scroll: 0,
  targetScroll: 0,
}

export let keyboard = {
  e: null
}

canvas.addEventListener('click', e => {
  switch (e.button) {
    case 0:
      mouse.left = true
      break
    case 2:
      mouse.right = true
      break
  }
})

canvas.addEventListener('mousedown', e => {
  mouse.held = true
})
canvas.addEventListener('mouseup', e => {
  mouse.held = false
})

canvas.addEventListener('contextmenu', e => {
  e.preventDefault()
  mouse.right = true
})

canvas.addEventListener("dblclick", () => {
  mouse.doubleClick = true
})

canvas.addEventListener('mousemove', e => {
  mouse.x = e.clientX
  mouse.y = e.clientY
})

canvas.addEventListener('wheel', e => {
  e.preventDefault()
  mouse.targetScroll -= Math.sign(e.deltaY) * 15
})

canvas.addEventListener('touchstart', e => {
  mouse.left = true
  mouse.x = e.touches[0].clientX
  mouse.y = e.touches[0].clientY
})
canvas.addEventListener('touchend', () => {
  mouse.left = false
})
canvas.addEventListener('touchmove', e => {
  mouse.x = e.touches[0].clientX
  mouse.y = e.touches[0].clientY
})

window.addEventListener('keydown', e => {
  keyboard.e = e
})
/*
window.addEventListener('keyup', e => {
  keyboard.key = null
})
*/
