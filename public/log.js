const Log = {
  startTime: Date.now(),
  get time() {
    return `[${new Date().toISOString()}] [${((Date.now() - Log.startTime) * 0.001).toFixed(3)}]`
  },
  error(reason, err) {
    console.error(Log.time, 'ERROR: ', reason, err)
  },
  warn(reason) {
    console.warn(Log.time, 'WARN: ', reason)
  }
}

export default Log