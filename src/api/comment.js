import global from '../../public/global.js'

const Comments = class {
  static async collect(id = 0) {
    try {
      let comments = []
      let url = new URL(`${global.api.url}index.php?page=dapi&s=comment&q=index&json=1`)
      url.searchParams.append('post_id', id)
      let response = await fetch(url)

      if (!response.ok) throw new Error(`HTTP error: ${response.status}`)
      let text = await response.text()
      let dom = new DOMParser()

      let xml = dom.parseFromString(text, 'text/xml')

      for (let comment of xml.getElementsByTagName('comment')) {
        let attr = comment.attributes
        let author = attr.creator.nodeValue
        let createdAt = attr.created_at.nodeValue
        let text = attr.body.nodeValue
        comments.push(new Comment(author, createdAt, text))
      }

      return comments
    } catch (err) {
      console.error('Fetch error:', err)
      return null
    }
  }
  constructor(author, createdAt, text) {
    this.author = author
    this.createdAt = createdAt
    this.comment = text
  }
}

export default Comments
