import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, signInWithRedirect } from 'https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js';
import { getFirestore, collection, addDoc, doc, getDoc, getDocs, setDoc, query, where } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCvJYz78dY4GEwXVcdEDxlp-O_8lO0fpeA",
  authDomain: "getatat-presentation.firebaseapp.com",
  projectId: "getatat-presentation",
  storageBucket: "getatat-presentation.appspot.com",
  messagingSenderId: "440108381558",
  appId: "1:440108381558:web:e4b264f8488ccd1e453657"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage};


