import global from './global.js'
import Tag from './components/tag.js'

const LocalStorage = class {
  static watch(entry) {
    return new LocalStorage(entry)
  }
  static clear() {
    localStorage.clear()
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
    return null
  }
  delete() {
    localStorage.removeItem(this.entry)
    this.value = null
  }
  verifyIntegrity({ expected, defaultTo }) {
    if (expected === 'array' && Array.isArray(this.value)) {
      this.set({ value: defaultTo })
    } else if (typeof this.value !== expected) {
      this.set({ value: defaultTo })
    }
  }
}

const Storage = {
  tags: LocalStorage.watch('tags'),
  options: {
    saveTags: LocalStorage.watch('saveTags')
  },
  ui: {
    snowFall: LocalStorage.watch('snowFall')
  },
  verifyIntegrity() {
    Storage.tags.verifyIntegrity({
      expected: 'array',
      defaultTo: [],
    })
    Storage.options.saveTags.verifyIntegrity({
      expected: 'boolean',
      defaultTo: true,
    })
    Storage.ui.snowFall.verifyIntegrity({
      expected: 'boolean',
      defaultTo: true,
    })
  },
  restore() {
    global.options.saveTags = Storage.options.saveTags.get()
    if (global.options.saveTags) {
      let storedTags = Storage.tags.get()
      global.api.activeTags = storedTags ? storedTags.map(label => Tag.create({ label, type: '' })) : []
    }

    global.ui.snowFall = Storage.ui.snowFall.get() ?? true
  }
}

export default Storage
