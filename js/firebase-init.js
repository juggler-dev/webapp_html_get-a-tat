import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, signInWithRedirect } from 'https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js';
import { getFirestore, collection, addDoc, doc, getDoc, getDocs, setDoc, query, where } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyC_Q9RWJouEvB5HNZ4SUSKyzgk2Zjt9Vok",
  authDomain: "getatat-project-team4.firebaseapp.com",
  databaseURL: "https://getatat-project-team4-default-rtdb.firebaseio.com",
  projectId: "getatat-project-team4",
  storageBucket: "getatat-project-team4.appspot.com",
  messagingSenderId: "771683602653",
  appId: "1:771683602653:web:1d7ba0a8a9eebbd8570b34"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage};


