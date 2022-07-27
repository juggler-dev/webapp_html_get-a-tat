import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, signInWithRedirect } from 'https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js';
import { getFirestore, collection, addDoc, doc, getDoc, getDocs, setDoc, query, where } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAD62OZpHkjQQ1Re0UdVuV3V1-03wfjm24",
  authDomain: "get-a-tat-2022.firebaseapp.com",
  projectId: "get-a-tat-2022",
  storageBucket: "get-a-tat-2022.appspot.com",
  messagingSenderId: "544066657375",
  appId: "1:544066657375:web:76ca54a2d2f684c4d50fea",
  measurementId: "G-N5VX4GRHQC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage};


