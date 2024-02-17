import Connection from './public/proxy.js'
import global from './public/global.js'
import Document from './public/document.js'
import Profiler from './public/profiler.js'
import Storage from './public/localstorage.js'
import Build from './public/repo.js'
import UI from './public/ui.js'

import Firebase from './src/firebase/main.js'

const ui = new UI()
Document.refreshCanvas(0)
ui.loadingText('server', 'Connecting to server...')
Connection.availableConnections = await Connection.sortServers()
global.switchServer()

ui.loadingText('build', 'Fetching build...')
await Build.load()

ui.loadingText('login', 'Loading Firebase...', true)
global.firebase = new Firebase()
await global.firebase.init()

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
