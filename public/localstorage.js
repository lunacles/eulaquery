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
    this.stored = this.get()
  }
  set({ value = null, expiration = Infinity }) {
    this.stored = value
    this.expiration = expiration
    let expiry = expiration ? Date.now() + expiration : null
    localStorage.setItem(this.entry, JSON.stringify({ value, expiry }))
    return this
  }
  get() {
    let item = localStorage.getItem(this.entry)
    if (item) {
      let { value, expiry } = JSON.parse(item)
      this.stored = item
      this.expiration = expiry
      if (expiry === null || expiry >= Date.now()) return value
      this.delete()
    }
    return null
  }
  delete() {
    localStorage.removeItem(this.entry)
    this.stored = null
  }
  verifyIntegrity({ expected, defaultTo }) {
    if (expected === 'array' && !Array.isArray(this.stored)) {
      this.set({ value: defaultTo })
    } else if (expected !== 'array' && typeof this.stored !== expected) {
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
  filter: {
    loli: LocalStorage.watch('loli'),
    furry: LocalStorage.watch('furry'),
    guro: LocalStorage.watch('guro'),
    rape: LocalStorage.watch('rape'),
    ai: LocalStorage.watch('ai'),
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

    for (let key of Object.keys(global.filter)) {
      Storage.filter[key].verifyIntegrity({
        expected: 'boolean',
        defaultTo: false,
      })
    }
  },
  restore() {
    // Options
    global.options.saveTags = Storage.options.saveTags.get()
    if (global.options.saveTags) {
      let storedTags = Storage.tags.get()
      global.api.activeTags = storedTags ? storedTags.map(label => Tag.create({ label, type: '' })) : []
    }

    // UI
    global.ui.snowFall = Storage.ui.snowFall.get() ?? true

    // Filter
    for (let key of Object.keys(global.filter)) {
      global.filter[key] = Storage.filter[key].get() ?? false
    }
  }
}
Storage.verifyIntegrity()
Storage.restore()

export default Storage
