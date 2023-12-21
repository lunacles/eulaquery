import global from '../../public/global.js'
import Media from '../../public/components/media.js'

export const Post = class {
  constructor(data) {
    this.previewUrl = data.preview_url ?? ''
    this.sampleUrl = data.sample_url ?? ''
    this.fileUrl = data.file_url ?? ''
    this.directory = data.directory ?? ''
    this.hash = data.hash ?? ''
    this.width = data.width ?? 0
    this.height = data.height ?? 0
    this.id = data.id ?? 0
    this.image = data.image ?? ''
    this.change = data.change ?? ''
    this.owner = data.owner ?? ''
    this.parentId = data.parent_id ?? ''
    this.rating = data.rating ?? ''
    this.sample = data.sample ?? ''
    this.sampleHeight = data.sample_height ?? 0
    this.sampleWidth = data.sample_width ?? 0
    this.score = data.score ?? 0
    this.tags = data.tags ?? []
    this.source = data.source ?? ''
    this.status = data.status ?? ''
    this.hasNotes = data.has_notes ?? false
    this.commentCount = data.comment_count ?? 0
    this.tagInfo = data.tag_info ?? []

    this.media = Media.image(this.fileUrl)
    //this.get()
  }
  get() {
    return new Promise(async (resolve, reject) => {
      let url = new URL(`${global.api.url}index.php?${global.api.posts}&fields=tag_info&json=1`)
      url.searchParams.append('id', id)
      let response = await fetch(url)
      if (!response.ok) reject(`HTTP error: ${response.status}`)
      let data = await response.json()
      this.data = data[0]
      resolve(this.data)
    })
  }
}

export const Page = class {
  static get({ page = 0, tags = [] }) {
    return new Page(page, tags)
  }
  constructor(page, tags) {
    this.page = page
    this.tags = tags
    this.url = this.getUrl()

    this.posts = null
    this.collect()
  }
  getUrl() {
    let url = `${global.api.url}index.php?${global.api.posts}&fields=tag_info${global.api.limit}&pid=${this.page}&json=1`
    return this.tags.length <= 0 ? url : `${url}&tags=${this.tags.join('+')}`
  }
  collect() {
    return new Promise(async (resolve, reject) => {
      let url = new URL(this.url)
      let response = await fetch(url.toString())
      if (!response.ok) reject(`HTTP error: ${response.status}`)
      let posts = await response.json()
      this.posts = posts.map(data => new Post(data))
      resolve(posts)
    })
  }
}
