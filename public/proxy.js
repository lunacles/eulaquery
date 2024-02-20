import Log from './log.js'
import * as util from './util.js'

const Connection = class {
  static timezone = new Date().getTimezoneOffset() / -60

  static availableConnections = []
  static token = ''
  static async checkServerAvailability() {
    let statuses = await Promise.all(Connection.statusPromises.map(promise => promise.catch(e => false)))
    this.proxies = this.proxies.filter((_, index) => statuses[index])
    if (!this.proxies.length) throw new Error('No available servers.')
    return this.sortServers()
  }

  constructor(id, data) {
    this.id = id
    this.to = data.to
    this.location = data.location
    this.timezone = -9
    this.distance = Math.abs(this.timezone - Connection.timezone)

    Connection.availableConnections.push(this)
  }
  async status() {
    try {
      let fetchPromise = fetch(this.to, {
        method: 'HEAD',
        headers: {
          'Content-Type': 'application/json'
        },
      })

      const response = await util.raceTimeout(fetchPromise, 75e2)
      return response.ok
    } catch (err) {
      Log.error(`Failed to connect to ${this.to}`, err)
      return false
    }
  }
  async connect() {
    try {
      let fetchPromise = await fetch(this.to, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          body: 'connect',
          adblock: false,
          dimensions: [window.innerWidth, window.innerHeight],
          mobile: 'ontouchstart' in document.body && /android|mobi/i.test(navigator.userAgent),
        })
      })

      const response = await util.raceTimeout(fetchPromise, 75e2)
      if (!response.ok) throw new Error('HTTP error')
      let json = await response.json()
      Connection.token = json.sessionToken
    } catch (err) {
      Log.error(`Failed to connect to ${this.to}`, err)
      return err
    }
  }
}

Connection.proxies = [
  new Connection('glitch-ash0', {
    to: 'https://eulaquery-4.glitch.me',
    location: 'Ashburn, USA',
    timezone: -3,
  }),
  new Connection('glitch-ash1', {
    to: 'https://eulaquery-5.glitch.me',
    location: 'Ashburn, USA',
    timezone: -3,
  }),
].sort((a, b) => a.distance - b.distance)

export default Connection
