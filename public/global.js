import Connection from './proxy.js'
import Color from './color.js'

const global = {
  canvas: null,
  ctx: null,
  firebase: null,
  scale: 1,
  keyboard: null,
  mobile: 'ontouchstart' in document.body && /android|mobi/i.test(navigator.userAgent),
  debug: false,
  reCaptchaKey: '6LfrlncpAAAAAHrtMx5VeBqtI9zrXcbhEEHNMQfH',
  rowSize: 1,
  api: {
    server: (() => {
      /*let utc = -(new Date().getTimezoneOffset() / 60)
      let regions = {
        //us: [-6], // this one is slow as fuck
        cali: [-9, -8, -7],
        img: [-1, 0, 1, 2, 3, 4, 5, -6],
        hk: [6, 7, 8, 9, 10, 11, 12, 13],
        miami: [-5, -4, -3, -2],
        ny: []
      }

      for (let region in regions) {
        if (regions[region].includes(utc))
          return region
      }*/
      return 'img'
    })(),
    url: 'https://api.rule34.xxx/',
    limit: 10,
    activeTags: [],
    page: 0,
    results: null,
    selectedPost: null,
  },
  font: {
    family: 'Ubuntu',
    style: 'bold',
    size: 16,
  },
  options: {
    saveTags: true,
  },
  ui: {
    snowFall: true,
  },
  filter: {
    loli: true,
    furry: false,
    guro: true,
    rape: false,
    ai: false,
  },
  clickOverride: {
    tags: false,
    keyboard: false,
    sidebar: false,
    search: false,
    account: false,
  },
  serverId: -1,
  server: null,
  async switchServer() {
    global.serverId = global.serverId + 1
    if (global.serverId >= Connection.availableConnections.length) throw new Error('No proxies available')

    global.server = Connection.availableConnections[global.serverId]
    try {
      let status = await global.server.connect()
      if (status instanceof Error) throw new Error(err)
    } catch (err) {
      this.switchServer()
    }
  },
}

Color.pureBlack = new Color('#000000')
Color.pureWhite = new Color('#ffffff')
Color.white = new Color('#f6f6f6')
Color.black = new Color('#0e0e0e')
Color.bgBlack = new Color('#202027')
Color.lightBlue = new Color('#b2dee6')
Color.burple = new Color('#5f66c4')
Color.navyBlue = new Color('#434879')
Color.emperor = new Color('#4e4447')
Color.darkGray = new Color('#333747')
Color.gray = new Color('#b2b2b2')
Color.red = new Color('#de7076')

Color.googleRed = new Color('#ea4335')
Color.googleYellow = new Color('#fbbc04')
Color.googleGreen = new Color('#34a853')
Color.googleBlue = new Color('#4285f4')

export default global
