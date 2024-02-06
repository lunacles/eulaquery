import Connection from './public/proxy.js'
import global from './public/global.js'
import Document from './public/document.js'
import Profiler from './public/profiler.js'
import Storage from './public/localstorage.js'
import Build from './public/repo.js'
import UI from './public/ui.js'

const ui = new UI()
Document.refreshCanvas(0)
ui.loadingScreen()
Connection.availableConnections = await Connection.sortServers()
global.server = Connection.availableConnections[0]
await Build.load()


let time = 0
let tick = 0
let appLoop = async (newTime) => {
  Profiler.logs.all.set()
  let timeElapsed = newTime - time
  time = newTime
  tick++

  Profiler.logs.rendering.set()

  ui.render(time)

  Profiler.logs.rendering.mark()

  Document.refreshCanvas(timeElapsed)

  Profiler.logs.all.mark()
  if (tick % 60 === 0)
    Profiler.checkSpeed()

  requestAnimationFrame(appLoop)
}
requestAnimationFrame(appLoop)
