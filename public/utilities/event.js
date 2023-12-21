import global from '../global.js'

export let mouse = {
  x: 0,
  y: 0,
  left: false,
  right: false,
  doubleClick: false,
  scroll: 0,
}

export let keyboard = {
  e: null
}

canvas.addEventListener('mousedown', e => {
  switch (e.button) {
    case 0:
      mouse.left = true
      break
    case 2:
      mouse.right = true
      break
  }
})
canvas.addEventListener('mouseup', e => {
  switch (e.button) {
    case 0:
      mouse.left = false
      break
    case 2:
      e.preventDefault()
      mouse.right = false
      break
  }
})

canvas.addEventListener('contextmenu', e => {
  e.preventDefault()
  mouse.right = true
})

canvas.addEventListener("dblclick", () => {
  mouse.doubleClick = true
})

canvas.addEventListener('mousemove', e => {
  mouse.x = e.clientX * window.devicePixelRatio
  mouse.y = e.clientY * window.devicePixelRatio
})

canvas.addEventListener('wheel', e => {
  e.preventDefault()
  mouse.scroll -= Math.sign(e.deltaY)
})

canvas.addEventListener('touchstart', e => {
  mouse.left = true
  mouse.x = e.touches[0].clientX
  mouse.y = e.touches[0].clientY
  mouse.left = false
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
