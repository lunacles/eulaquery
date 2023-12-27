import {
  Circle,
} from '../elements.js'
import global from '../global.js'
import Document from '../document.js'

const Snowflake = class {
  static create({ x = 0, y = 0, radius = 0, delta = 0 }) {
    return new Snowflake(x, y, radius, delta)
  }
  constructor(x, y, radius, delta) {
    this.x = x
    this.y = y
    this.radius = radius
    this.delta = delta

    this.angle = Math.PI * 2 * Math.random()
  }
  update() {
    this.angle += 0.005
    this.x += Math.sin(this.angle) * 2
    this.y += Math.cos(this.angle + this.delta) + 1 + this.radius / 10

    if (this.x > Document.width + 5 || this.x < -5 || this.y > Document.height) {
      this.x = Math.random() * Document.width
      this.y = -10
    }
  }
  draw() {
    Circle.draw({
      x: this.x, y: this.y, radius: this.radius
    }).alpha(0.98).fill(global.colors.white)
    this.update()
  }
}

const Snowfall = class {
  constructor(max) {
    this.max = max
    this.particles = Array(max).fill().map(() => Snowflake.create({
      x: Math.random() * Document.width,
      y: Math.random() * -Document.height,
      radius: Math.random() * 8 + 1,
      delta: Math.random() * this.max
    }))

    this.angle = 0
  }
  draw() {
    for (let particle of this.particles) {
      particle.draw()
    }
  }
}

export default Snowfall
