////////////////// IMPORTS //////////////////

import { auth, db } from "./firebase-init.js";
import {
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithRedirect,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js';
import { addDoc, doc, setDoc, getDoc, getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";

import { storeSessionUserData, readSessionUserData } from "./session-storage.js";

////////////////// GLOBAL VARIABLES //////////////////

const SESSION_USER_KEY_VALUE = "sessionUser";

const USER_TYPE_CLIENT = "client";
const USER_TYPE_ARTIST = "artist";

const HOME_CLIENT = "home-client.html";
const HOME_ARTIST = "home-artist.html";

const LOGIN_CLIENT_PAGE_NAME = "Login - Client";
const LOGIN_ARTIST_PAGE_NAME = "Login - Artist";

////////////////// CLASSES //////////////////

class SessionUser {
  constructor(user_type, full_name, email, phoneNumber, city, postalCode, uid) {
    this.user_type = user_type;
    this.full_name = full_name;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.city = city;
    this.postalCode = postalCode;
    this.uid = uid;
  }
}

////////////////// FUNCTION //////////////////

function createNewSessionUser(userType, full_name, email, phoneNumber, city, postalCode, uid) {
  return new SessionUser(userType, full_name, email, phoneNumber, city, postalCode, uid);
}

async function saveSessionUserDataOnSessionStorage(collection, sessionUserUid) {

  //Firestore Query
  const docRef = doc(db, collection, sessionUserUid);
  const docSnap = await getDoc(docRef);

  //Object creation
  const sessionUserObject = createNewSessionUser(
    docSnap.data().user_type,
    docSnap.data().full_name,
    docSnap.data().email,
    docSnap.data().phoneNumber,
    docSnap.data().city,
    docSnap.data().postalCode,
    docSnap.data().uid);

  //Data stored on SessionStorage
  storeSessionUserData(SESSION_USER_KEY_VALUE, sessionUserObject)

  //Moving to next window
  if (docSnap.data().user_type == USER_TYPE_CLIENT) {
    console.log("happening! Again");
    // window.location.href = HOME_CLIENT;
    window.location.href = "../index.html";
  }

  if (docSnap.data().user_type == USER_TYPE_ARTIST) {
    // window.location.href = HOME_ARTIST;
    window.location.href = "../index.html";
  }

}

////////////////// EVENTS //////////////////


// NEW SIGN IN - EMAIL/PASSWORD

document.getElementById('signInBtn').addEventListener('click', () => {

  const userEmail = document.getElementById('emailUser').value;
  const userPassword = document.getElementById('passwordUser').value;

  signInWithEmailAndPassword(auth, userEmail, userPassword)
    .then(reponse => {

      onAuthStateChanged(auth, (user) => {
        if (document.title == LOGIN_CLIENT_PAGE_NAME) {
          console.log("happening!");
          saveSessionUserDataOnSessionStorage("clients", user.uid);
        };
        if (document.title == LOGIN_ARTIST_PAGE_NAME) {
          saveSessionUserDataOnSessionStorage("artists", user.uid);
        };
      });
    })
    .catch((err) => {
      console.log(err.code)
      console.log(err.message)
      
      const errorMessage = document.getElementById('errorMessage')
      errorMessage.innerHTML = 'Email/password incorrect. Please try again'
    
  
    })
})



//////////////////// GOOGLE FACEBOOK LOGIN ////////////////////


// // SIGN UP AND SIGN IN WITH GOOGLE
// document.getElementById('signUpGoogle').addEventListener('click', () => {
//   signInWithPopup(auth, provider)
//     .then((result) => {
//       // This gives you a Google Access Token. You can use it to access the Google API.
//       const credential = GoogleAuthProvider.credentialFromResult(result);
//       console.log(result.user);
//       window.location.href = "login-account.html"

//       const token = credential.accessToken;
//       // The signed-in user info.
//       const user = result.user;

//       // ...
//     }).catch((error) => {
//       // Handle Errors here.
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       // The email of the user's account used.
//       const email = error.customData.email;
//       // The AuthCredential type that was used.
//       const credential = GoogleAuthProvider.credentialFromError(error);
//       // ...
//     });
// })


// // SIGN UP AND SIGN IN WITH FACEBOOK
// document.getElementById('signUpFacebook').addEventListener('click', () => {
//   signInWithPopup(auth, providerTwo)
//     .then((result) => {
//       // This gives you a Google Access Token. You can use it to access the Google API.
//       const credential = FacebookAuthProvider.credentialFromResult(result);
//       console.log(result.user);
//       window.location.href = "login-account.html"

//       const token = credential.accessToken;
//       // The signed-in user info.
//       const user = result.user;

//       // ...
//     }).catch((error) => {
//       // Handle Errors here.
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       // The email of the user's account used.
//       const email = error.customData.email;
//       // The AuthCredential type that was used.
//       const credential = GoogleAuthProvider.credentialFromError(error);
//       // ...
//     });
// })

// // ===================== GET CURRENT USER =======================
// onAuthStateChanged(auth, (user) => {
//   if (user) {

//     console.log('user logged in', user)
//     // console.log(user.uid);
//     // console.log(user.email);


//     // ...
//   } else {
//     // User is signed out
//     // ...

//     console.log('user logged out');

//   }
// });