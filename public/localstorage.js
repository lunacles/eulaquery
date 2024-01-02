import global from './global.js'
import Tag from './components/tag.js'

const LocalStorage = class {
  static watch(entry) {
    return new LocalStorage(entry)
  }
  static clear() {
    localStorage.clear()
  }
  static restore() {
    let storedTags = LocalStorage.watch('tags').get() ?? []
    global.api.activeTags = storedTags.length > 0 ? storedTags.map(label => Tag.create({ label, type: '' })) : storedTags

    let options = LocalStorage.watch('options').get()
    global.options.saveTags = options.saveTags
    global.options.snowFall = options.snowFall
  }
  constructor(entry) {
    this.entry = entry
    this.value = this.get()
  }
  set({ value = null, expiration = Infinity }) {
    this.value = value
    this.expiration = expiration
    let expiry = expiration ? Date.now() + expiration : null
    localStorage.setItem(this.entry, JSON.stringify({ value, expiry }))
    return this
  }
  get() {
    let item = localStorage.getItem(this.entry)
    if (item) {
      let { value, expiry } = JSON.parse(item)
      this.value = item
      this.expiration = expiry
      if (expiry === null || expiry >= Date.now()) return value
        this.delete()
    }
  }
  delete() {
    localStorage.removeItem(this.entry)
    this.value = null
  }
}

export default LocalStorage
