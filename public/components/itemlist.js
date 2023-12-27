const ItemList = class {
  static create({ items = [], spacing = 0 }) {
    return new ItemList(items, spacing)
  }
  constructor(items, spacing) {
    this.items = items
    this.spacing = spacing

    this.maxLength = 0
    this.list = [[]]

    this.sort()
  }
  sort() {
    this.list = [[]]
    let length = 0
    let list = 0
    for (let item of this.items) {
      if (length + this.spacing + item.size <= this.maxLength) {
        this.list[list].push(item.info)
        length += this.spacing + item.size
      } else {
        list++
        length = this.spacing + item.size
        this.list.push([item.info])
      }
    }
  }
  update({ items = [], spacing = 0, maxLength = 0 }) {
    this.items = items
    this.spacing = spacing
    this.maxLength = maxLength

    this.sort()
  }
}

export default ItemList
