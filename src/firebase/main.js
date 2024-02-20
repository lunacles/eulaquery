import {
  initializeApp
} from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js'
import {
  getAnalytics
} from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-analytics.js'

import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  signOut as firebaseSignOut,
} from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js'

import {
	getFirestore,
  doc,
  getDoc,
  setDoc,
} from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js'

import config from './config.js'
import Log from '../../public/log.js'
import UserDoc from './storage.js'
import Media from '../../public/components/media.js'

const app = initializeApp(config)
const Firebase = class {
  static app = app
  static analytics = getAnalytics(app)
  static auth = getAuth(app)
  static db = getFirestore(app)
  constructor() {
    this.googleAuth = new GoogleAuthProvider()
    this.user = null
    this.userDoc = null
    this.profilePicture = null

    this.signingIn = false
    this.signingOut = false
  }
  appCheck() {
  }
  async init() {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(Firebase.auth, async (user) => {
        if (user) {
          this.user = user
          this.profilePicture = Media.image(this.user.photoURL, true)
          Log.info(`Logged in as user ${this.user.displayName}`)
          try {
            await this.fetchUserDoc(user)
            resolve()
          } catch (err) {
            Log.error('Failed to fetch user document', err)
            reject(err)
          }
        } else {
          resolve()
        }
      })
    })
  }
  async fetchUserDoc(user) {
    let userDocRef = doc(Firebase.db, 'users', user.uid)
    let docSnap = await getDoc(userDocRef)
    if (!docSnap.exists()) {
      await setDoc(userDocRef, UserDoc.create(user))
      Log.info(`Created new document for user ${user.displayName}`)
    } else {
      Log.info(`Imported document of user ${user.displayName}`)
    }
    this.userDoc = new UserDoc(userDocRef, user)
  }
  async signIn() {
    if (this.signingIn) return
    this.signingIn = true
    try {
      await setPersistence(Firebase.auth, browserLocalPersistence)
      this.user = await signInWithPopup(Firebase.auth, this.googleAuth)

      Log.info(`Signed in successfully as user ${this.user.displayName}`)
    } catch (err) {
      Log.error('Sign in error:', err)
    }
    this.signingIn = false
  }
  async signOut() {
    if (this.signingOut) return
    this.signingOut = true
    try {
      Log.info(`Signing out user ${this.user.displayName}`)
      await firebaseSignOut(Firebase.auth)
      this.user = null
      this.userDoc = null
      this.profilePicture = null
    } catch (err) {
      Log.error('Sign out error:', err)
    }
    this.signingOut = false
  }
}

export default Firebase
