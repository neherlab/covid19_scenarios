import firebase from 'firebase/app'

const firebaseConfig = {
  apiKey: "AIzaSyB_T7TXfC2cjOS3VgqGBd-Yn-7R_j2UzIk",
  authDomain: "covid19-scenarios.firebaseapp.com",
  databaseURL: "https://covid19-scenarios.firebaseio.com",
  projectId: "covid19-scenarios",
  storageBucket: "covid19-scenarios.appspot.com",
  messagingSenderId: "880897171256",
  appId: "1:880897171256:web:5b5a83a9d3045083d42bcd"
}

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