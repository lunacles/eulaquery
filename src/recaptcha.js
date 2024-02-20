import Log from '../public/log.js'
import * as util from '../public/util.js'
import Firebase from './firebase/main.js'
import global from '../public/global.js'

import {
  initializeAppCheck,
  ReCaptchaV3Provider
} from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-check.js'

const reCaptcha = class {
  constructor(publicToken) {
    this.publicToken = publicToken
    this.token = null
  }
  async init() {
    const script = await this.load()
    if (!script) throw new Error('reCaptcha failed to load')

    const appCheck = await this.appCheck()
    if (!appCheck) throw new Error('Appcheck failed')
  }
  async load() {
    let captcha = new Promise((resolve, reject) => {
      let script = document.createElement('script')
      script.src = `https://www.google.com/recaptcha/api.js?render=${this.publicToken}`
      script.async = true
      script.defer = true
      document.head.appendChild(script)
      script.onload = () => resolve(true)
      script.onerror = err => reject(err)
    })

    try {
      const timeout = await util.raceTimeout(captcha, 5e3)
      if (!timeout) throw new Error()
      Log.info('reCAPTCHA library loaded')
    } catch (err) {
      Log.error('reCaptcha library failed to load', err)
      return false
    }

    return true
  }
  async appCheck() {
    let appCheck = initializeAppCheck(Firebase.app, {
      provider: new ReCaptchaV3Provider(global.reCaptchaKey),
      isTokenAutoRefreshEnabled: true
    })
    console.log(appCheck)
    try {
      const timeout = await util.raceTimeout(appCheck, 5e3)
      if (!timeout) throw new Error()
      Log.info('Verified app-check')
    } catch (err) {
      Log.error('Failed to verify app-check', err)
      return false
    }
    return true
  }
}

export default reCaptcha
