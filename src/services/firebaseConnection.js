import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyAVl71YO2CK9eM7Z_nYKh69IZFP2tQmBVY",
    authDomain: "tickets-5d318.firebaseapp.com",
    projectId: "tickets-5d318",
    storageBucket: "tickets-5d318.appspot.com",
    messagingSenderId: "230276016871",
    appId: "1:230276016871:web:c810c16ed46572552f9042",
    measurementId: "G-SYQFPNW5VT"
};

const firebaseApp = initializeApp(firebaseConfig)

const auth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp)
const storage = getStorage(firebaseApp)

export {auth, db, storage}