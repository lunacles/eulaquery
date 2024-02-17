import Log from './log.js'

const Connection = class {
  static timezone = new Date().getTimezoneOffset() / -60

  static availableConnections = []
  static statusPromises = []
  static token = ''
  static async sortServers() {
    let statuses = await Promise.all(Connection.statusPromises)
    let availableConnections = statuses.map((status, i) => ({
      proxy: Connection.proxies[i],
      status: status,
    })).filter(item => item.status)

    return availableConnections.sort((a, b) => a.proxy.distance - b.proxy.distance).map(item => item.proxy)
  }

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

    Connection.statusPromises.push(this.status())
  }
  async requestTimeout(timeout) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Request timed out'))
      }, timeout)
    })
  }
  async status() {
    try {
      let fetchPromise = fetch(this.to, {
        method: 'HEAD',
        headers: {
          'Content-Type': 'application/json'
        },
      })

      let timeout = this.requestTimeout(75e2)

      const response = await Promise.race([fetchPromise, timeout])
      return response.ok
    } catch (err) {
      Log.error(`Failed to connect to ${this.to}`, err)
      return false
    }
  }
  async connect() {
    try {
      let response = await fetch(this.to, {
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
      if (!response.ok) throw new Error('HTTP error')
      let json = await response.json()
      Connection.token = json.sessionToken
    } catch (err) {
      Log.error(err)
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
]

export default Connection
