import { initializeApp } from 'firebase/app'
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  increment,
  setDoc,
} from 'firebase/firestore'
// import { getAnalytics } from "firebase/analytics";
import { v4 as uuid } from 'uuid'

const firebaseConfig = {
  apiKey: 'AIzaSyBZuJUUo37jRqVCdXzPPNqnj95jr60JnhA',
  authDomain: 'target-5000.firebaseapp.com',
  projectId: 'target-5000',
  storageBucket: 'target-5000.appspot.com',
  messagingSenderId: '900525823460',
  appId: '1:900525823460:web:5cc652579d278850f1e3f1',
  measurementId: 'G-27JMEHP1QD',
}

const COLLECTION_ID = '0123'
const NAME_APP = 'speedtest-sample'

// Initialize Firebase
const app = initializeApp(firebaseConfig)
// const analytics = getAnalytics(app);
const firestore = getFirestore(app)
const database = collection(firestore, COLLECTION_ID)

let staticDoc = null
let luid = null

export const getInitialValue = async () => {
  luid = window.localStorage.getItem(NAME_APP)
  if (!luid) {
    luid = uuid()
    window.localStorage.setItem(NAME_APP, luid)
  }
  staticDoc = doc(database, luid)
  const document = await getDoc(staticDoc)
  const data = document.data()
  return {
    value: data?.value || 0,
    steps: data?.steps || 50,
    target: data?.target || 1000,
  }
}

export const submitConfig = async ({ steps, target }) => {
  await setDoc(staticDoc, { steps, target }, { merge: true })
  return { result: true, steps, target }
}

export const submitValue = async (value) => {
  if (!staticDoc) return 0
  const parsedValue = value || 0
  await setDoc(staticDoc, { value: increment(parsedValue) }, { merge: true })
  const updatedDocument = await getDoc(staticDoc)
  return updatedDocument.data().value
}
