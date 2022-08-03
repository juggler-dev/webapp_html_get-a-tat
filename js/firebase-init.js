import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, signInWithRedirect } from 'https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js';
import { getFirestore, collection, addDoc, doc, getDoc, getDocs, setDoc, query, where } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDUu3s-vcQ5hoRlQvysbYoiUbuqxYNsEiw",
  authDomain: "team4-getatat.firebaseapp.com",
  projectId: "team4-getatat",
  storageBucket: "team4-getatat.appspot.com",
  messagingSenderId: "875984770516",
  appId: "1:875984770516:web:7c282c9a45c2d21d5d3241",
  measurementId: "G-KSY5ZHQRY7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage};


