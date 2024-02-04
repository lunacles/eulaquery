import * as util from './util.js'
import global from './global.js'
import Log from './log.js'

const Profiler = class {
  static mspt = 0
  static init() {
    Profiler.logs = {
      processor: new Profiler(),
      media: new Profiler(),
      page: new Profiler(),
      rendering: new Profiler(),
      api: new Profiler(),
      all: new Profiler(),
    }
  }
  static checkSpeed() {
    Profiler.mspt = Profiler.logs.all.getAverage()

    let timeTrace = {}
    for (let [entry, profile] of Object.entries(Profiler.logs)) {
      timeTrace[entry] = profile.sum()
    }

    if (Profiler.mspt > 1e3) {
      Log.error(`Client overloaded with ${Profiler.mspt.toFixed(1)}mspt! Final time trace: `, timeTrace)
      throw new Error('Client overloaded')
    } else if (Profiler.mspt > 10) {
      Log.warn(`Client overloading with ${Profiler.mspt.toFixed(1)}mspt. Time trace: `, timeTrace)
    }
  }
  constructor() {
    this.data = []
    this.time = Date.now()
    this.totalSum = 0
  }
  set() {
    this.time = Date.now()
  }
  mark() {
    let duration = Date.now() - this.time
    this.totalSum += duration
    this.data.push(duration)
  }
  getAverage() {
    return util.averageArray(this.data)
  }
  sum() {
    let o = util.sumArray(this.data)
    this.data = []
    return o
  }
}

Profiler.init()

export default Profiler
