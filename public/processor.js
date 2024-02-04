import Profiler from './profiler.js'
import global from './global.js'
import Log from './log.js'

// Fuck CORS
const processor = async (src) => {
  return new Promise(async (resolve, reject) => {
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
    if (!response.ok) reject(`HTTP error: ${response.status}`)
    let blob = await response.blob()
    let url = URL.createObjectURL(blob)
    let buffer = await blob.arrayBuffer().then(arrayBuffer => new Uint8Array(arrayBuffer))
    Profiler.logs.processor.mark()

    resolve({ url, buffer })
  })
}

export default processor
