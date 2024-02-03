import {
  Circle,
  Clip,
  Line,
  Rect,
  RoundRect,
  Text,
} from "../elements.js"
import Media from './media.js'
import Input from './input.js'

import global from '../global.js'
import * as util from '../util.js'
import Document from '../document.js'

const defaultAccountPfp = Media.image('../../assets/silhouette.svg', true)
const usernameBox = Input.create({ maxLength: 25, placeholder: 'Username', placeholderColor: util.mixColors(global.colors.burple, global.colors.darkGray, 0.4) })
const passwordBox = Input.create({ maxLength: 32, placeholder: 'Password', placeholderColor: util.mixColors(global.colors.burple, global.colors.darkGray, 0.4) })

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

    this.usernameInput = usernameBox
    this.passwordInput = passwordBox

    this.spacing = 7.5
    this.headerHeight = Document.height * 0.05 * 0.85
  }
  usernameBox({ x = 0, y = 0, width = 0, height = 0 }) {
    RoundRect.draw({
      x, y,
      width, height,
    }).both(util.mixColors(global.colors.burple, global.colors.darkGray, 0.2), util.mixColors(global.colors.burple, global.colors.darkGray, 0.4), 6)
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

      Text.draw({
        x, y: y + height + this.spacing * 3,
        size: this.spacing * 1.5,
        align: 'left',
        text: message,
      }).fill(global.colors.red)
    }
  }
  passwordBox({ x = 0, y = 0, width = 0, height = 0 }) {
    RoundRect.draw({
      x, y,
      width, height,
    }).both(util.mixColors(global.colors.burple, global.colors.darkGray, 0.2), util.mixColors(global.colors.burple, global.colors.darkGray, 0.4), 6)
    passwordBox.draw({
      x: x + width * 0.5, y: y + height * 0.5,
      width: width - 5, height: height - 7.5,
      t: this.t,
    })
  }
  drawProfilePicture({ x = 0, y = 0, radius = 0 }) {
    Circle.draw({
      x: x - radius, y: y - radius,
      radius,
    }).stroke(global.colors.navyBlue, 4)
    Clip.circle({
      x: x - radius, y: y - radius,
      radius,
    })
    if (defaultAccountPfp.loaded) {
      defaultAccountPfp.draw({
        x: x - radius * 0.875, y: y - radius + radius * 0.15,
        width: radius * 1.75, height: radius * 1.75
      })
      Rect.draw({
        x: x - radius * 0.75, y: y - radius + radius * 1.85,
        width: radius * 1.5, height: radius
      }).fill(global.colors.navyBlue)
    }
    Clip.end()
  }
  loginButton({ x = 0, y = 0, width = 0, height = 0 }) {
    RoundRect.draw({
      x: x - width * 0.5, y,
      width, height,
    }).both(util.mixColors(global.colors.burple, global.colors.darkGray, 0.4), util.mixColors(global.colors.burple, global.colors.darkGray, 0.6), 6)
    Text.draw({
      x, y: y + height * 0.7,
      size: height * 0.6,
      text: 'Login',
      align: 'center'
    }).fill(global.colors.white)
  }
  login() {
    let textSize = this.headerHeight * 0.6
    let x = this.x + this.width * 0.5
    let y = this.y + this.headerHeight + this.spacing + textSize * 1.25

    Text.draw({
      x, y,
      size: textSize,
      align: 'center',
      text: 'Login'
    }).fill(global.colors.white)

    let pfpRadius = x * 0.3
    this.drawProfilePicture({
      x, y: y + textSize + pfpRadius,
      radius: pfpRadius
    })

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
  }
  profile() {
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
    }).both(global.colors.burple, util.mixColors(global.colors.burple, global.colors.darkGray, 0.6), 6)

    let textSize = util.fitTextToArea({
      text: 'Account',
      width: this.width,
      height: Document.height * 0.05 * 0.75
    })
    Text.draw({
      x: this.x + this.width * 0.5, y: this.y + textSize * 0.9,
      size: textSize,
      alight: 'center',
      text: 'Account',
    }).fill(global.colors.white)

    Line.draw({
      x1: this.x, y1: this.y + textSize + this.spacing * 0.8,
      x2: this.x + this.width, y2: this.y + textSize + this.spacing * 0.8,
    }).stroke(util.mixColors(global.colors.burple, global.colors.darkGray, 0.6), 4)

    this.login()
  }
}

export default AccountPage
