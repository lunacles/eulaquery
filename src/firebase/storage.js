import Log from '../../public/log.js'
import {
	updateDoc,
} from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js'
import global from '../../public/global.js'
import Connection from '../../public/proxy.js'

const SessionLog = class {
  constructor(startTime) {
    this.startTime = parseInt(startTime)
    this.id = Connection.token

    this.searches = []
    this.postsObserved = []
    this.preferences = {}
    this.token = ''
  }
  writeLog() {
    let session = {
      startTime: this.startTime,
      endTime: Date.now(),
      searches: this.searches,
      postsObserved: this.postsObserved,
      preferences: [{
        'options': global.options,
        'filter': global.filter,
        'ui': global.ui
      }]
    }
    session.base64 = btoa(JSON.stringify(session))
    return session
  }
  appendSearch(search) {
    this.searches.push(search)
  }
  appendPost(post) {
    if (!this.postsObserved.includes(post))
      this.postsObserved.push(post)
  }
}

const UserDoc = class {
  static create(user) {
    return {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      profile_picture: user.photoURL,
      verified_email: user.emailVerified,
      created_at: parseInt(user.metadata.createdAt),
      creation_time: user.metadata.creationTime,
      session_logs: {}
    }
  }
  constructor(doc, user) {
    this.doc = doc
    this.user = user
    this.session = new SessionLog(this.user.metadata.lastLoginAt)
  }
  async writeSessionLog() {
    await updateDoc(this.doc, {
      [`session_logs.${this.session.id}`]: this.session.writeLog(),
    })
    Log.info(`Logged session ID "${this.session.id}"`)
  }
}

export default UserDoc
