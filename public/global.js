const global = {
  title: '',
  canvas: null,
  ctx: null,
  scale: 1,
  clickOverride: false,
  api: {
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
  }
}

export default global
