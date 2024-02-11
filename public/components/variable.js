const Variable = class {
  constructor({ value = undefined, type = undefined, staticType = false, mutable = true, }) {
    this.type = type ?? typeof value
    this.staticType = staticType
    this.mutable = mutable
    this.varValue = value

    this.mutatedType = false
    this.mutated = false
  }
  set value(newValue) {
    if (!this.mutable) throw new SyntaxError(`Cannot change a non-mutable value for ${this}`)
    if (this.staticType && this.type !== typeof newValue) {
    console.log(this.value, newValue)
    throw new TypeError(`Cannot change static variable of type ${this.type} to ${typeof newValue} for ${this}`)
    }
    if (this.type !== typeof newValue) {
      this.mutatedType = true
      this.type = typeof newValue
    }
    this.mutated = true
    this.varValue = newValue
    return newValue
  }
  get value() {
    return this.varValue
  }
  dismissMutation() {
    this.mutatedType = false
    this.mutated = false
    return this
  }
  compare(comparedVar) {
    if (!(comparedVar instanceof Variable))
      comparedVar = new Variable({ value: comparedVar, type: typeof comparedVar })

    if (this.type !== comparedVar.type) return false
    if (this.type === 'number' || this.type === 'string' || this.varValue == undefined || comparedVar.varValue == undefined) return this.varValue === comparedVar.varValue
    if (typeof comparedVar.type === 'object') {
      if (Array.isArray(this.varValue) && Array.isArray(comparedVar.varValue)) {
        if (this.varValue.length !== comparedVar.varValue.length) return false

        for (let i = 0; i < this.varValue.length; i++)
          if (this.varValue[i] !== comparedVar.varValue[i]) return false
      } else {
        let entries = Object.entries(this.varValue)
        if (Object.entries(comparedVar.varValue).length !== entries.length) return false
        for (let [key, varValue] of entries) {
          if (!comparedVar[key] || !comparedVar[key] !== varValue) return false
          delete comparedVar[key]
        }
      }
    }
    return true
  }
}

export default Variable
