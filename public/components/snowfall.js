import {
  Circle,
} from '../elements.js'
import global from '../global.js'
import Document from '../document.js'

// Refactored someone else's code cuz im lazy lol
const Snowfall = class {
  constructor(max) {
    this.max = max
    this.particles = Array(max).fill().map(() => ({
      x: Math.random() * Document.width,
      y: Math.random() * Document.height,
      r: Math.random() * 8 + 1,
      d: Math.random() * this.max
    }))

    this.angle = 0
  }
  draw() {
    for (let particle of this.particles) {
      Circle.draw({
        x: particle.x, y: particle.y, radius: particle.r
      }).alpha(0.98).fill(global.colors.white)
    }
    this.update()
  }
  update() {
    this.angle += 0.005
    for (let [i, particle] of this.particles.entries()) {
      particle.x += Math.sin(this.angle) * 2
      particle.y += Math.cos(this.angle + particle.d) + 1 + particle.r / 10

      if (particle.x > Document.width + 5 || particle.x < -5 || particle.y > Document.height) {
        if (i % 3 > 0) {
          this.particles[i] = {
            x: Math.random() * Document.width, y: -10,
            r: particle.r, d: particle.d
          }
        } else {
          if (Math.sin(this.angle) > 0) {
            this.particles[i] = {
              x: -5, y: Math.random() * Document.height,
              r: particle.r, d: particle.d
            }
          } else {
            this.particles[i] = {
              x: Document.width + 5, y: Math.random() * Document.height,
              r: particle.r, d: particle.d
            }
          }
        }
      }
    }
  }
}

export default Snowfall
