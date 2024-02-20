import {
  Circle,
  Clip,
  Line,
  Rect,
  Arc,
  RoundRect,
  Text,
} from '../elements.js'
import global from '../global.js'
import Media from './media.js'
//import Input from './input.js'

import Color from '../color.js'
import * as util from '../util.js'
import Document from '../document.js'
import TextObjects from '../textobjects.js'
import Button from './button.js'
import Icon from './icon.js'

const defaultAccountPfp = Media.image('../../assets/silhouette.svg', true)
//const usernameBox = Input.create({ maxLength: 25, placeholder: 'Username', placeholderColor: Color.blend(Color.burple, Color.darkGray, 0.4) })
//const passwordBox = Input.create({ maxLength: 32, placeholder: 'Password', placeholderColor: Color.blend(Color.burple, Color.darkGray, 0.4) })
const googleIcon = Icon.create('google')
const signOutButton = Button.create({
  onUpdate: async (e) => {
    await global.firebase.signOut()
  }
})
const googleAuthButton = Button.create({
  onUpdate: async (e) => {
    await global.firebase.signIn()
  }
})

const AccountPage = class {
  static create(hook) {
    return new AccountPage(hook)
  }
  constructor(hook) {
    this.hook = hook

    this.x = 0
    this.y = 0
    this.width = 0
    this.height = 0
    this.t = 0

    this.spacing = 7.5
    this.headerHeight = Document.height * 0.05 * 0.85
  }
  /*
  usernameBox({ x = 0, y = 0, width = 0, height = 0 }) {
    RoundRect.draw({
      x, y,
      width, height,
    }).both(Color.blend(Color.burple, Color.darkGray, 0.2), Color.blend(Color.burple, Color.darkGray, 0.4), 6)
    usernameBox.draw({
      x: x + width * 0.5, y: y + height * 0.5,
      width: width - 5, height: height - 7.5,
      t: this.t,
    })

    let rules = [
      [usernameBox.text.length <= 1 || usernameBox.text.length >= 25, 'must be between 2 and 24 characters long'],
      [!/^[a-zA-Z0-9-_]+$/.test(usernameBox.text), 'cannot contain symbols or special characters'],
      [false, 'is already taken'] // TODO: Implement this
    ]
    if (rules.some(rule => rule[0]) && usernameBox.text.length > 0) {
      let failedRules = rules.filter(rule => rule[0])
      let message = `Username ${failedRules[0][1]}.`

      TextObjects.usernameWarning.draw({
        x, y: y + height + this.spacing * 3,
        size: this.spacing * 1.5,
        align: 'left',
        text: message,
      }).fill(Color.red)
    }
  }
  passwordBox({ x = 0, y = 0, width = 0, height = 0 }) {
    RoundRect.draw({
      x, y,
      width, height,
    }).both(Color.blend(Color.burple, Color.darkGray, 0.2), Color.blend(Color.burple, Color.darkGray, 0.4), 6)
    passwordBox.draw({
      x: x + width * 0.5, y: y + height * 0.5,
      width: width - 5, height: height - 7.5,
      t: this.t,
    })
  }
  */
  drawGoogleAuth({ x = 0, y = 0, width = 0, height = 0 }) {
    let spacing = height * 0.2
    RoundRect.draw({
      x, y,
      width, height,
    }).both(
      Color.blend(Color.white, Color.black, 0.1),
      Color.blend(Color.white, Color.black, 0.3),
    6)
    googleIcon.draw({
      x: x + spacing, y: y + spacing,
      width: height * 0.6, height: height * 0.6,
    })
    googleAuthButton.update({
      x, y,
      width, height,
    })
    TextObjects.auth.google.draw({
      x: x + height + spacing, y: y + height * 0.65,
      size: height * 0.5,
      align: 'left',
      text: 'Sign in with Google',
    }).fill(Color.blend(Color.white, Color.black, 0.51))
  }
  drawDiscordAuth({ x = 0, y = 0, width = 0, height = 0 }) {
    let spacing = height * 0.2
    RoundRect.draw({
      x, y,
      width, height,
    }).both(
      Color.blend(Color.white, Color.black, 0.1),
      Color.blend(Color.white, Color.black, 0.3),
    6)
    googleIcon.draw({
      x: x + spacing, y: y + spacing,
      width: height * 0.6, height: height * 0.6,
    })
    if (global.firebase.user) {
      googleAuthButton.update({
        x, y,
        width, height,
      })
    }

    TextObjects.auth.google.draw({
      x: x + height + spacing, y: y + height * 0.65,
      size: height * 0.5,
      align: 'left',
      text: 'Sign in with google',
    }).fill(Color.blend(Color.white, Color.black, 0.51))
  }
  drawSignOutButton({ x = 0, y = 0, width = 0, height = 0 }) {
    RoundRect.draw({
      x, y,
      width, height,
    }).both(
      Color.blend(Color.burple, Color.darkGray, 0.2),
      Color.blend(Color.burple, Color.darkGray, 0.4),
    6)
    if (global.firebase.user) {
      signOutButton.update({
        x, y,
        width, height,
      })
    }

    TextObjects.auth.signOut.draw({
      x: x + width * 0.5, y: y + height * 0.65,
      size: height * 0.5,
      align: 'center',
      text: 'Sign out',
    }).fill(Color.white)
  }
  drawProfilePicture({ x = 0, y = 0, radius = 0 }) {
    Clip.circle({
      x: x - radius, y: y - radius,
      radius,
    })
    if (global.firebase.user && global.firebase.profilePicture?.loaded) {
      global.firebase.profilePicture.draw({
        x: x - radius, y: y - radius,
        width: radius * 2, height: radius * 2
      })
    } else if (defaultAccountPfp.loaded) {
      defaultAccountPfp.draw({
        x: x - radius * 0.875, y: y - radius + radius * 0.15,
        width: radius * 1.75, height: radius * 1.75
      })
      Rect.draw({
        x: x - radius * 0.75, y: y - radius + radius * 1.85,
        width: radius * 1.5, height: radius
      }).fill(Color.navyBlue)
    }
    Clip.end()
    Circle.draw({
      x: x - radius, y: y - radius,
      radius,
    }).stroke(Color.navyBlue, 5)
  }
  loginButton({ x = 0, y = 0, width = 0, height = 0 }) {
    RoundRect.draw({
      x: x - width * 0.5, y,
      width, height,
    }).both(Color.blend(Color.burple, Color.darkGray, 0.4), Color.blend(Color.burple, Color.darkGray, 0.6), 6)
    TextObjects.login.draw({
      x, y: y + height * 0.7,
      size: height * 0.6,
      text: 'Login',
      align: 'center'
    }).fill(Color.white)
  }
  profile() {
    let textSize = this.headerHeight * 0.6
    let x = this.x + this.width * 0.5
    let y = this.y + this.headerHeight + this.spacing + textSize * 1.25

    TextObjects[global.firebase.user ? 'user' : 'login'].draw({
      x, y,
      size: textSize,
      align: 'center',
      text: global.firebase.user ? global.firebase.user.displayName : 'Login'
    }).fill(Color.white)

    let pfpRadius = x * 0.3
    this.drawProfilePicture({
      x, y: y + textSize + pfpRadius,
      radius: pfpRadius
    })

    let loginY = y + textSize + pfpRadius * 2 + this.spacing * 2
    let loginWidth = this.width * 0.66
    let loginHeight = this.height * 0.05
    if (global.firebase.user) {
      this.drawSignOutButton({
        x: x - loginWidth * 0.5, y: loginY,
        width: loginWidth, height: loginHeight,
      })
    } else {
      this.drawGoogleAuth({
        x: x - loginWidth * 0.5, y: loginY,
        width: loginWidth, height: loginHeight,
      })
    }
    /*
    let inputZoneY = y + textSize + pfpRadius * 2 + this.spacing * 2
    let inputWidth = this.width * 0.66
    let inputHeight = this.height * 0.05
    this.usernameBox({
      x: x - inputWidth * 0.5, y: inputZoneY,
      width: inputWidth, height: inputHeight,
    })
    this.passwordBox({
      x: x - inputWidth * 0.5, y: inputZoneY + inputHeight + this.spacing * 5,
      width: inputWidth, height: inputHeight,
    })

    let loginY = inputZoneY + inputHeight * 2 + this.spacing * 10
    this.loginButton({
      x, y: loginY,
      width: inputWidth, height: inputHeight,
    })
    */
  }
  draw({ x = 0, y = 0, width = 0, height = 0, t = 0 } = {}) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.t = t

    RoundRect.draw({
      x: this.x, y: this.y,
      width: this.width, height: this.height
    }).both(Color.burple, Color.blend(Color.burple, Color.darkGray, 0.6), 6)

    let textSize = util.fitTextToArea({
      text: 'Account',
      width: this.width,
      height: Document.height * 0.05 * 0.75
    })
    TextObjects.headers.account.draw({
      x: this.x + this.width * 0.5, y: this.y + textSize * 0.9,
      size: textSize,
      alight: 'center',
      text: 'Account',
    }).fill(Color.white)

    Line.draw({
      x1: this.x, y1: this.y + textSize + this.spacing * 0.8,
      x2: this.x + this.width, y2: this.y + textSize + this.spacing * 0.8,
    }).stroke(Color.blend(Color.burple, Color.darkGray, 0.6), 4)

    this.profile()
  }
}

export default AccountPage
