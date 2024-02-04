import Profiler from './profiler.js'
import global from './global.js'
import Log from './log.js'

// Fuck CORS
const processRequest = async (src) => {
  Profiler.logs.processor.set()
  let response = await fetch(global.server.to, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      body: 'process', 
      minWidth: global.api.postWidth, 
      url: src.replace(/api-cdn(-mp4)?/g, global.api.server),
    })
  })
  if (!response.ok) throw new Error('HTTP error')
  let blob = await response.blob()
  let url = URL.createObjectURL(blob)
  let buffer = await blob.arrayBuffer().then(arrayBuffer => new Uint8Array(arrayBuffer))
  
  Profiler.logs.processor.mark()

  return { url, buffer }
}

const processor = async (src) => {
  try {
    let data = await processRequest(src)
    return data
  } catch (err) {
    global.switchServer()

    if (!global.server) {
      Log.error('No available servers left to switch to.')
      throw new Error('All servers attempted, none available')
    }

    return processor(src)
  }
}

export default processor
