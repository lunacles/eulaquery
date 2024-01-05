import global from './public/global.js'
import Storage from './public/localstorage.js'
import Document from './public/document.js'
import Profiler from './public/profiler.js'
import UI from './public/ui.js'

const ui = new UI()

let time = 0
let tick = 0
let appLoop = async (newTime) => {
  let timeElapsed = newTime - time
  time = newTime
  tick++

  Profiler.logs.rendering.set()
  ui.render(time)
  if (global.debug && tick % 1e3 === 0) {
    Profiler.logs.rendering.mark()
    console.log('Rendering time:', `${Profiler.logs.rendering.sum()}ms`)
  }

  //Profiler.checkSpeed()

  Document.refreshCanvas()
  requestAnimationFrame(appLoop)
}
requestAnimationFrame(appLoop)
