const global = {
  canvas: null,
  ctx: null,
  scale: 1,
  clickOverride: false,
  keyboard: null,
  mobile: 'ontouchstart' in document.body && /android|mobi/i.test(navigator.userAgent),
  debug: false,
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
  },
  font: {
    family: 'Ubuntu',
    style: 'bold',
    size: 16,
  },
  colors: {
    pureBlack: '#000000',
    pureWhite: '#ffffff',
    white: '#f6f6f6',
    black: '#0e0e0e',
    bgBlack: '#202027',

    lightBlue: '#b2dee6',
    burple: '#5f66c4',
    navyBlue: '#434879',
    emperor: '#4e4447',
    darkGray: '#333747',
    gray: '#b2b2b2',
  },
  options: {
    saveTags: true,
  },
  ui: {
    snowFall: true,
  },
  filter: {
    loli: false,
    furry: false,
    guro: false,
    rape: false,
    ai: false,
  },
}

export default global
