// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator, initializeFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1BGjBTeufcPkL-mos9qD9Xf15fsUrIZQ",
  authDomain: "tourmanager-aa882.firebaseapp.com",
  projectId: "tourmanager-aa882",
  storageBucket: "tourmanager-aa882.appspot.com",
  messagingSenderId: "1023494941999",
  appId: "1:1023494941999:web:058f5ec73195837e2b85da",
  measurementId: "G-DDHNJVRJVN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export {db, auth};