import firebase from 'firebase/app'
import { firebaseConfig } from '../../firebaseconf'

export async function init() {
  await firebase.initializeApp(firebaseConfig)
}

export async function createUserWithEmail(email: string, password: string) {
  try {
    await firebase.auth().createUserWithEmailAndPassword(email, password)
    const uid = firebase.auth().currentUser?.uid

    // TODO better error
    if (!uid) throw new Error('Something went wrong')

    // TODO add default values or get them from localStorage
    setUserData(uid, {})
  }
  catch (error) {
    throw new Error(error.message)
  }
}

function signInWithEmail(email: string, password: string) {
  firebase.auth().signInWithEmailAndPassword(email, password)
}

function signOut() {
  firebase.auth().signOut()
}

function setAuthObserver(fn: Function) {
  firebase.auth().onAuthStateChanged(user => {
    fn(user)
  })
}

// TODO data typing
function setUserData(uid: string, data: any) {
  firebase.firestore().collection('users').doc(uid).set(data, { merge: true })
}

async function getUserData(uid: string) {
  const doc = await firebase.firestore().collection('users').doc(uid).get()
  
  if (doc.exists) {
    return doc.data()
  }

  throw new Error('User data not found')
}