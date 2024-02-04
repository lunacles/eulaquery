import global from './global.js'

const Log = {
  startTime: Date.now(),
  get time() {
    return `[${new Date().toISOString()}] [${((Date.now() - Log.startTime) * 0.001).toFixed(3)}]`
  },
  error(reason, err) {
    console.error(Log.time, 'ERROR: ', reason, err)
  },
  profiler(task, profile) {
    if (!global.debug) return
    console.log(Log.time, `${task} completed after ${profile}ms`)
  },
  warn(warning, reason) {
    console.warn(Log.time, 'WARN: ', warning, reason)
  }
}

export default Log