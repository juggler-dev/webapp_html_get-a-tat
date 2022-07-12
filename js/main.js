import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, signInWithRedirect } from 'https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js';
import { getFirestore, collection, addDoc, doc, getDoc, setDoc  } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAw0RBWZgTpqCkdH6B3oWhU9rXjpz7-7Bw",
  authDomain: "juggler-test-project.firebaseapp.com",
  projectId: "juggler-test-project",
  storageBucket: "juggler-test-project.appspot.com",
  messagingSenderId: "1082104770953",
  appId: "1:1082104770953:web:cbef63c511a7248aa3b158",
  measurementId: "G-0CMQ3R7X0X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();
const providerTwo = new FacebookAuthProvider();
const usersCollectionRef = collection(db,'users');
const artistsCollectionRef = collection(db, 'artists');



export { auth, db, storage, provider, providerTwo, usersCollectionRef, artistsCollectionRef };



