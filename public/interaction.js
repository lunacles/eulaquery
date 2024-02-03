import Document from './document.js'

const Interaction = class {
  static editEvent(e) {
    return new Interaction(e)
  }
  static mouse = {
    x: 0,
    y: 0,
    left: false,
    right: false,
    middle: false,
    leftHeld: false,
    rightHeld: false,
    middleHeld: false,
    drag: {
      x: 0,
      y: 0,
    },
    touchStartY: 0,
    currentTouchY: 0,
    scroll: 0,
    targetScroll: 0,
    moving: 0,
  }
  static keyboard = {
    altKey: false,
    ctrlKey: false,
    shiftKey: false,
    code: null,
    key: null,
  }
  static settings = new Map([
    ['mouse', new Map([
      ['preventDefault', true],
      ['dispatchAfterRelease', true],
      ['scrollSpeed', 15],
    ])]
  ])
  static events = new Map([
    ['mousedown', {
      assigned: null,
      'default': e => {
        let dispatchAfterRelease = Interaction.settings.get('mouse').get('dispatchAfterRelease')
        if (e.buttons & 1) {
          Interaction.mouse.left = !dispatchAfterRelease
          Interaction.mouse.leftHeld = true
        }
        if (e.buttons & 2) {
          Interaction.mouse.right = !dispatchAfterRelease
          Interaction.mouse.rightHeld = true
        }
        if (e.buttons & 4) {
          Interaction.mouse.middle = !dispatchAfterRelease
          Interaction.mouse.middleHeld = true
        }
      },
      'mouseDrag': e => {
        if (!Interaction.mouse.drag) return
        let x = (e.offsetX - Document.width / 2) / Math.min(Document.width, Document.height)
        let y = (e.offsetY - Document.height / 2) / Math.min(Document.width, Document.height)
        
        Interaction.mouse.drag.x = x
        Interaction.mouse.drag.y = y
      }
    }],
    ['mouseup', {
      assigned: null,
      'default': e => {
        let dispatchAfterRelease = Interaction.settings.get('mouse').get('dispatchAfterRelease')
        if (Interaction.mouse.leftHeld) {
          Interaction.mouse.left = dispatchAfterRelease
          Interaction.mouse.leftHeld = false
        }
        if (Interaction.mouse.rightHeld) {
          Interaction.mouse.right = dispatchAfterRelease
          Interaction.mouse.rightHeld = false
        }
        if (Interaction.mouse.middleHeld) {
          Interaction.mouse.middle = dispatchAfterRelease
          Interaction.mouse.middleHeld = false
        }
      },
    }],
    ['mousemove', {
      assigned: null,
      'default': e => {
        Interaction.mouse.x = e.clientX
        Interaction.mouse.y = e.clientY
      },
      'mouseDrag': e => {
        Interaction.mouse.drag = {
          x: (e.offsetX - Document.width / 2) / Math.min(Document.width, Document.height),
          y: (e.offsetY - Document.height / 2) / Math.min(Document.width, Document.height),
        }
      }
    }],
    ['wheel', {
      assigned: null,
      'default': e => {
        if (Interaction.settings.get('mouse').get('preventDefault'))
          e.preventDefault()
        
        Interaction.mouse.targetScroll -= Math.sign(e.deltaY) * Interaction.settings.get('mouse').get('scrollSpeed')
      }
    }],
    ['contextmenu', {
      assigned: null,
      'default': e => {
        if (Interaction.settings.get('mouse').get('preventDefault'))
          e.preventDefault() 
      }
    }],
    ['click', {
      assigned: null,
      'default': e => {}
    }],
    ['dbclick', {
      assigned: null,
      'default': e => {}
    }],
    ['mouseenter', {
      assigned: null,
      'default': e => {}
    }],
    ['mouseleave', {
      assigned: null,
      'default': e => {}
    }],
    ['mouseout', {
      assigned: null,
      'default': e => {}
    }],
    ['mouseover', {
      assigned: null,
      'default': e => {}
    }],
    ['touchstart', {
      assigned: null,
      'default': e => {
        if (Interaction.settings.get('mouse').get('preventDefault'))
          e.preventDefault() 

        Interaction.mouse.left = !Interaction.settings.get('mouse').get('dispatchAfterRelease')
        Interaction.mouse.leftHeld = true
        Interaction.mouse.x = e.touches[0].clientX
        Interaction.mouse.y = e.touches[0].clientY
        Interaction.mouse.touchStartY = e.touches[0].clientY
      }
    }],
    ['touchcancel', {
      assigned: null,
      'default': e => {
        Interaction.mouse.left = Interaction.settings.get('mouse').get('dispatchAfterRelease')
        Interaction.mouse.leftHeld = false
      }
    }],
    ['touchend', {
      assigned: null,
      'default': e => {
        Interaction.mouse.left = Interaction.settings.get('mouse').get('dispatchAfterRelease')
        Interaction.mouse.leftHeld = false
      }
    }],
    ['touchmove', {
      assigned: null,
      'default': e => {
        Interaction.mouse.moving = true
        Interaction.mouse.currentTouchY = e.touches[0].clientY
        Interaction.mouse.x = e.touches[0].clientX
        Interaction.mouse.y = e.touches[0].clientY
        let deltaY = Interaction.mouse.touchStartY - Interaction.mouse.currentTouchY
        Interaction.mouse.targetScroll -= deltaY
        Interaction.mouse.touchStartY = Interaction.mouse.currentTouchY
      }
    }],
    ['keydown', {
      assigned: null,
      useWindow: true,
      'default': e => {
        Interaction.keyboard.altKey = e.altKey
        Interaction.keyboard.ctrlKey = e.ctrlKey
        Interaction.keyboard.shiftKey = e.shiftKey
        Interaction.keyboard.keyCode = e.keyCode
        Interaction.keyboard.key = e.key
      }
    }]
  ])
  static reset() {
    Interaction.keyboard = {
      altKey: false,
      ctrlKey: false,
      shiftKey: false,
      keyCode: null,
      key: null,
    }
    Interaction.mouse.left = false
    Interaction.mouse.right = false
    Interaction.mouse.middle = false
    Interaction.mouse.moving = false
  }
  constructor(event) {
    this.event = event
    this.element = Interaction.events.get(this.event)
    if (!this.element) throw new Error(`Unable to find event ${this.event}`)
  }
  getEvent(task) {
    if (!this.element[task]) throw new Error(`Unable to assign task ${task} to ${this.event}`)
    return this.element[task]
  }
  bind(task) {
    if (this.element.assigned)
      canvas.removeEventListener(this.event, this.element.assigned)

    let e = this.getEvent(task)
    ;(this.element.useWindow ? window : canvas).addEventListener(this.event, e)
    this.element.assigned = e
    Interaction.events.set(this.event, this.element)
  }
}

export default Interaction