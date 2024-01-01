import * as util from './util.js'

const Profiler = class {
  static mspt() {
    return Profiler.logs.all.getAverage()
  }
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
    let processor = Profiler.logs.processor.sum()
    let media = Profiler.logs.media.sum()
    let page = Profiler.logs.page.sum()
    let rendering = Profiler.logs.rendering.sum()
    let api = Profiler.logs.api.sum()
    let all = Profiler.logs.all.sum()

    console.log(`Total mspt: ${Profiler.mspt()}`, {
      processor,
      media,
      page,
      rendering,
      api,
      all,
    })
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
