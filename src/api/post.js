import global from '../../public/global.js'
import Media from '../../public/components/media.js'
import Profiler from '../../public/profiler.js'

import { Filters } from './filter.js'

export const Post = class {
  constructor(data) {
    // Not important data
    this.sampleUrl = data.sample_url ?? ''
    this.sampleHeight = data.sample_height ?? 0
    this.sampleWidth = data.sample_width ?? 0
    this.parentId = data.parent_id ?? ''
    this.directory = data.directory ?? ''
    this.image = data.image ?? ''
    this.status = data.status ?? ''
    this.hasNotes = data.has_notes ?? false
    this.sample = data.sample ?? ''
    this.hash = data.hash ?? ''
    this.tags = data.tags ?? []

    // Important data
    this.previewUrl = data.preview_url ?? ''
    this.fileUrl = data.file_url ?? ''
    this.width = data.width ?? 0
    this.height = data.height ?? 0

    this.data = {
      id: data.id ?? 0,
      owner: data.owner ?? '',
      rating: data.rating ?? '',
      score: data.score ?? 0,
      commentCount: data.comment_count ?? 0,
      tagInfo: data.tag_info ?? [],
      source: data.source ?? '',
      change: data.change ?? ''
    }
    
    // TODO Make this provide a default image from assets if the media isn't available to prevent an exception
    this.file = {
      width: this.width,
      height: this.height,
      type: ['mp4', 'webm'].includes(this.fileUrl.substring(this.fileUrl.lastIndexOf('.') + 1)) ? 'video' : 'image',
      src: null,
    }
    this.thumbnail = this.file.type === 'video' ? this.getMedia(this.sampleUrl) : null

    this.filteredFor = []
    for (let [type, _] of Object.entries(global.filter).filter(([_, state]) => state)) {
      let filtered = Filters[type].check(this.data.tagInfo.map(data => data.tag))
      if (filtered)
        this.filteredFor.push(type)
    }
  }
  loadFile() {
    this.file.src = this.getMedia(this.fileUrl)
  }
  getMedia(url) {
    switch (url.substring(url.lastIndexOf('.') + 1)) {
      case 'mp4':
      case 'webm':
        return Media.video(url)
      case 'gif':
        return Media.gif(url)
      default:
        return Media.image(url)
    }
  }
  get() {
    return new Promise(async (resolve, reject) => {
      let url = new URL(`${global.api.url}index.php?page=dapi&s=post&q=index&fields=tag_info&json=1`)
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

    this.id = (() => {
      let now = new Date()
      let timestamp = now.getTime()
      let random = Math.random().toString(36).substring(2, 15)
      return `query-${timestamp}-${random}`
    })()

    this.posts = []

    Profiler.logs.api.set()
    this.collect()
    Profiler.logs.api.mark()

    this.logLoadingSpeed()
  }
  logLoadingSpeed() {
    Profiler.logs.page.set()
    let check = setInterval(() => {
      if (Array.isArray(this.posts) && this.posts.every(post => post.file.src.loaded)) {
        Profiler.logs.page.mark()

        clearInterval(check)
      }
    }, 33)
  }
  getUrl() {
    let url = `${global.api.url}index.php?page=dapi&s=post&q=index&fields=tag_info&limit=${global.api.limit}&pid=${this.page}&json=1`
    return this.tags.length <= 0 ? url : `${url}&tags=${this.tags.map(r => r.label).join('+')}`
  }
  collect() {
    return new Promise(async (resolve, reject) => {
      let url = new URL(this.url)
      let response = await fetch(url.toString())
      if (!response.ok) reject(`HTTP error: ${response.status}`)
      let posts = await response.json()
      for (let data of posts)
        this.posts.push(new Post(data))
      resolve(posts)
    })
  }
  add(page) {
    this.page = page
    this.url = this.getUrl()
    this.collect()
  }
}
