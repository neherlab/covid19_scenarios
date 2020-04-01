import firebase from 'firebase/app'
import { firebaseConfig } from '../../firebaseconf'

async function init() {
  await firebase.initializeApp(firebaseConfig)
}

function createUserWithEmail(email: string, password: string) {
  firebase.auth().createUserWithEmailAndPassword(email, password)
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