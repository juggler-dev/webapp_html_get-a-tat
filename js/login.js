////////////////// IMPORTS //////////////////

import { auth, db, provider, providerTwo } from "./main.js";
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

////////////////// GLOBAL VARIABLES //////////////////


////////////////// CLASSES //////////////////

class Client {
  constructor(name, email, city, uid) {
    this.name = name;
    this.email = email;
    this.city = city;
    this.uid = uid;
  }
}

////////////////// FUNCTION //////////////////

function createNewSessionUser(name, email, city, uid) {
  return new Client(name, email, city, uid);
}

async function saveSessionUserData(collection, sessionUserUid) {

  //Firestore Query
  const docRef = doc(db, collection, sessionUserUid);
  const docSnap = await getDoc(docRef);

  //Object Stringification
  const sessionUserData = JSON.stringify(createNewSessionUser(docSnap.data().full_name, docSnap.data().email, docSnap.data().city, docSnap.data().uid));

  // console.log(sessionUserData);

  //Data Saved on SessionStorage
  sessionStorage.setItem("sessionUser", sessionUserData);

  //Moving to next window
  window.location.href = "home-user.html"

  // return sessionUserData;


}

////////////////// EVENTS //////////////////


// NEW SIGN IN - EMAIL/PASSWORD

document.getElementById('signInBtn').addEventListener('click', () => {

  const userEmail = document.getElementById('emailUser').value;
  const userPassword = document.getElementById('passwordUser').value;

  signInWithEmailAndPassword(auth, userEmail, userPassword)
    .then(reponse => {

      onAuthStateChanged(auth, (user) => {
        saveSessionUserData("users", user.uid);
        // console.log(saveSessionUserData("users", user.uid));
      });


    })

    .catch((err) => {
      console.log(err.code)
      console.log(err.message)
    })
})

// SIGN UP AND SIGN IN WITH GOOGLE
document.getElementById('signUpGoogle').addEventListener('click', () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      console.log(result.user);
      window.location.href = "login-account.html"

      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;

      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
})


// SIGN UP AND SIGN IN WITH FACEBOOK
document.getElementById('signUpFacebook').addEventListener('click', () => {
  signInWithPopup(auth, providerTwo)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      console.log(result.user);
      window.location.href = "login-account.html"

      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;

      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
})





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