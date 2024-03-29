import TextObj from './components/text.js'

const TextObjects = {
  keyboard: new Map(['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '/', ' ', '.', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '@', '#', '$', '_', '&', '-', '+', '(', ')', '*', '"', '\'', ':', ';', '!', '?', ',', 'SwapAlphabetical', 'SwapNumeric'].map(r => [r, TextObj.create()])),
  autoComplete: Array(10).fill().map(() => Array(2).fill().map(() => TextObj.create())),
  loading: {
    login: TextObj.create('"Trebuchet MS", sans-serif'),
    build: TextObj.create('"Trebuchet MS", sans-serif'),
    server: TextObj.create('"Trebuchet MS", sans-serif'),
  },
  pcWarning: [TextObj.create(), TextObj.create()],
  footer: {
    copyright: TextObj.create(),
    copyrightHolder: TextObj.create(),
    buildId: TextObj.create(),
    serverId: TextObj.create(),
  },
  usernameWarning: TextObj.create(),
  login: TextObj.create(),
  user: TextObj.create(),
  auth: {
    google: TextObj.create(),
    discord: TextObj.create(),
    signOut: TextObj.create(),
  },
  headers: {
    account: TextObj.create(),
    contentFilter: TextObj.create(),
    options: TextObj.create(),
    eulaquery: [TextObj.create(), TextObj.create()],
  },
  menuHeaders: {
    options: TextObj.create(),
    contentFilter: TextObj.create(),
    presetFilters: TextObj.create(),
  },
  contentFilters: Array(5).fill().map(() => TextObj.create()),
  options: Array(2).fill().map(() => TextObj.create()),
  tags: new Map(),
}

export default TextObjects
