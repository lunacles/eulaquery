import Profiler from './profiler.js'
import global from './global.js'
import Log from './log.js'
import Connection from './proxy.js'

// Fuck CORS
const processor = async (src) => {
  Profiler.logs.processor.set()
  try {
    let response = await fetch(global.server.to, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        body: 'process',
        token: Connection.token,
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
  } catch (err) {
    Profiler.logs.processor.mark()
    Log.warn('Failed to fetch media')
  }
}

export default processor
