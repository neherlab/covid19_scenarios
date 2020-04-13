import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

import { firebaseConfig } from '../firebaseconf'

export async function init() {
  await firebase.initializeApp(firebaseConfig)
}

export async function createUserWithEmail(email: string, password: string) {
  try {
    await firebase.auth().createUserWithEmailAndPassword(email, password)
    const uid = getCurrentUser()

    // TODO better error
    if (!uid) throw new Error('Something went wrong')

    // TODO add default values or get them from localStorage
    setUserData(uid, { scenarios: [] })
    return uid
  } catch (error) {
    throw new Error(error.message)
  }
}

export async function signInWithEmail(email: string, password: string) {
  await firebase.auth().signInWithEmailAndPassword(email, password)
  return getCurrentUser()
}

export async function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider()

  try {
    const result = await firebase.auth().signInWithPopup(provider)
    return result.user
  } catch (error) {
    throw new Error(error.message)
  }
}

export function signOut() {
  firebase.auth().signOut()
}

export function setAuthObserver(fn: Function) {
  firebase.auth().onAuthStateChanged((user) => {
    fn(user)
  })
}

export function getCurrentUser() {
  return firebase.auth().currentUser?.uid
}

export function setUserData(uid: string, data: any) {
  firebase.firestore().collection('users').doc(uid).set(data, { merge: true })
}

export async function getUserData(uid: string) {
  const doc = await firebase.firestore().collection('users').doc(uid).get()

  if (doc.exists) {
    return doc.data()
  }

  return {}
}

// TODO scenario typing
export async function addScenario(uid: string, scenarioData: any) {
  const addedScenarioRef = await firebase.firestore().collection('scenarios').doc()
  addedScenarioRef.set({ ...scenarioData, uid })

  firebase
    .firestore()
    .collection('users')
    .doc(uid)
    .update({
      scenarios: firebase.firestore.FieldValue.arrayUnion(addedScenarioRef.id),
    })
}

export async function getScenarioData(scenarioId: string) {
  const doc = await firebase.firestore().collection('scenarios').doc(scenarioId).get()

  if (doc.exists) {
    return doc.data()
  }

  throw new Error('Scenario data not found')
}

export async function deleteScenario(scenarioId: string, uid: string) {
  const docRef = firebase.firestore().collection('scenarios').doc(scenarioId)
  const docData = (await docRef.get()).data()

  if (docData && docData.uid === uid) {
    docRef.delete()
    const userRef = await firebase.firestore().collection('users').doc(uid).get()
    const userData = userRef.data()
    const newUserScenarios = userData?.scenarios.filter((scenario: string) => scenario !== scenarioId)
    userRef.ref.set({ scenarios: newUserScenarios }, { merge: true })

    return
  }

  throw new Error('Scenario not found or you are not the owner')
}
