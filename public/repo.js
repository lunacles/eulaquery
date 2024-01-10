import * as util from './util.js'

const Build = {
  id: 'unknown',
  date: 0,
  message: '',
  diff: '',
  async load() {
    try {
      let response = await fetch('https://api.github.com/repos/damocIes/eulaquery/commits/main')
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }
      let json = await response.json()
      Build.id = json.sha.slice(0, 7)
      Build.message = json.commit.message
      Build.diff = json.html_url
      Build.date = util.formatDate(json.commit.author.date)
    } catch (err) {
      console.error('Error loading commit data:', err)
    }
  },
}
Build.load()

export default Build
