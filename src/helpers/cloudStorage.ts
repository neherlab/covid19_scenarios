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

export function signInWithEmail(email: string, password: string) {
  firebase.auth().signInWithEmailAndPassword(email, password)
}

export function signOut() {
  firebase.auth().signOut()
}

export function setAuthObserver(fn: Function) {
  firebase.auth().onAuthStateChanged(user => {
    fn(user)
  })
}

export function getCurrentUser() {
  return firebase.auth().currentUser?.uid
}

// TODO data typing
export function setUserData(uid: string, data: any) {
  firebase.firestore().collection('users').doc(uid).set(data, { merge: true })
}

export async function getUserData(uid: string) {
  const doc = await firebase.firestore().collection('users').doc(uid).get()
  
  if (doc.exists) {
    return doc.data()
  }

  throw new Error('User data not found')
}

// TODO scenario typing
export async function addScenario(uid: string, scenarioData: any) {
  const addedScenarioRef = await firebase.firestore().collection('scenarios').doc()
  addedScenarioRef.set({ ...scenarioData, uid })
  
  firebase.firestore().collection('users').doc(uid).update({
    scenarios: firebase.firestore.FieldValue.arrayUnion(addedScenarioRef.id)
  })
}

export async function getScenarioData(scenarioId: string) {
  const doc = await firebase.firestore().collection('scenarios').doc(scenarioId).get()

  if (doc.exists) {
    return doc.data()
  }

  throw new Error('Scenario data not found')
}