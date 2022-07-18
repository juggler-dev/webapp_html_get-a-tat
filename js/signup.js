////////////////// IMPORTS //////////////////

import { auth } from "./firebase-init.js";
import { CLIENTS_COLLECTION_REFERENCE, ARTISTS_COLLECTION_REFERENCE } from "./firestore-references.js";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js';
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";

////////////////// GLOBAL VARIABLES //////////////////

const USER_TYPE_CLIENT = "client";
const USER_TYPE_ARTIST = "artist";
const SIGN_UP_CLIENT = "Sign Up - Client";
const SIGN_UP_ARTIST = "Sign Up - Artist";
const HOME_CLIENT = "home-client.html";
const HOME_ARTIST = "home-artist.html";


// ============ SIGN UP EMAIL & PASSWORD ============
document.getElementById('signUpBtn').addEventListener('click', (e) => {
  e.preventDefault();

  //Getting the email and password values
  const userEmail = document.getElementById('emailUser').value;
  const userPassword = document.getElementById('passwordUser').value;

  if (document.title == SIGN_UP_CLIENT) {

    // createUserWithEmailAndPassword(auth, userEmail, userPassword) 
    createUserWithEmailAndPassword(auth, userEmail, userPassword)
      .then((newClient) => {
        setDoc(doc(CLIENTS_COLLECTION_REFERENCE, newClient.user.uid), {
          user_type: USER_TYPE_CLIENT,
          full_name: document.getElementById('fName').value,
          email: newClient.user.email,
          city: document.getElementById('city').value,
          postal_code: document.getElementById('postalCode').value,
          phone_number: document.getElementById('phoneNumber').value,
          uid: newClient.user.uid,

        }).then(() => {
          window.location.href = HOME_CLIENT;
        });
      })
      .catch((err) => {
        console.log(err.code)
        console.log(err.message)
      })

  }

  if (document.title == SIGN_UP_ARTIST) {

    // createUserWithEmailAndPassword(auth, userEmail, userPassword) 
    createUserWithEmailAndPassword(auth, userEmail, userPassword)
      .then((newArtist) => {
        setDoc(doc(ARTISTS_COLLECTION_REFERENCE, newArtist.user.uid), {
          user_type: USER_TYPE_ARTIST,
          full_name: document.getElementById('artist_full_name').value,
          email: newArtist.user.email,
          city: document.getElementById('artist_city').value,
          postal_code: document.getElementById('artist_postal_code').value,
          phone_number: document.getElementById('artist_phone_number').value,
          bio: document.getElementById('artist_bio').value,
          website: document.getElementById('website_url').value,
          instagram: document.getElementById('instagram_url').value,
          uid: newArtist.user.uid

        }).then(() => {
          window.location.href = HOME_ARTIST;
        });
      })
      .catch((err) => {
        console.log(err.code)
        console.log(err.message)
      })

  }


})

// // ============ Sign up and sign in with Google ============
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

// // ============ Sign up and sign in with Facebook ============
// document.getElementById('signUpFacebook').addEventListener('click', () => {
//   signInWithPopup(auth, providerTwo)
//     .then((result) => {
//       // The signed-in user info.
//       const user = result.user;

//       // This gives you a Facebook Access Token. You can use it to access the Facebook API.
//       const credential = FacebookAuthProvider.credentialFromResult(result);
//       const accessToken = credential.accessToken;

//       // ...
//     })
//     .catch((error) => {
//       // Handle Errors here.
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       // The email of the user's account used.
//       const email = error.customData.email;
//       // The AuthCredential type that was used.
//       const credential = FacebookAuthProvider.credentialFromError(error);

//       // ...
//     });
// })










