const Connection = class {
  static timezone = new Date().getTimezoneOffset() / -60

  static statusPromises = []
  static async getClosest() {
    let statuses = await Promise.all(Connection.statusPromises)
    let closestConnection = null
    let closest = Infinity

    for (let [i, status] of statuses.entries()) {
      if (status && Connection.proxies[i].distance < closest) {
        closest = Connection.proxies[i].distance
        closestConnection = Connection.proxies[i]
      }
    }

    return closestConnection
  }
  constructor(id, data) {
    this.id = id
    this.to = data.to
    this.location = data.location
    this.timezone = -9
    this.distance = Math.abs(this.timezone - Connection.timezone)

    Connection.statusPromises.push(this.status())
  }
  async status() {
    try {
      let fetchPromise = fetch(this.to, {
        method: 'HEAD',
        headers: {
          'Content-Type': 'application/json'
        },
      })
  
      let timeout = new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error("Request timed out"))
        }, 5e3)
      })
  
      const response = await Promise.race([fetchPromise, timeout])
      return response.ok
    } catch (err) {
      console.error(`Failed to connect to Connection ${this.to}`, err)
      return false
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
