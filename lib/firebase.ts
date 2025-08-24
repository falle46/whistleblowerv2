import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCF6rTqjbLJ0xtHPhru1Yjv59dSZuFvRxI",
  authDomain: "whistleblower-elnusa-787b3.firebaseapp.com",
  projectId: "whistleblower-elnusa-787b3",
  storageBucket: "whistleblower-elnusa-787b3.firebasestorage.app",
  messagingSenderId: "957429788720",
  appId: "1:957429788720:web:05bcde53d2aa863f68bdf5",
  measurementId: "G-3N8B3ZJ7W6",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)

export default app
