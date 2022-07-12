import { auth, db, provider, providerTwo, usersCollectionRef  } from "./main.js";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider  } from 'https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js';
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";


// ============ Sign up and sign in with Google ============
document.getElementById('signUpGoogle').addEventListener('click', () => {
signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    console.log(result.user);
    window.location.href  = "login-account.html"

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

// ============ Sign up and sign in with Facebook ============
document.getElementById('signUpFacebook').addEventListener('click', () => {
signInWithPopup(auth, providerTwo)
  .then((result) => {
    // The signed-in user info.
    const user = result.user;

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const accessToken = credential.accessToken;

    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = FacebookAuthProvider.credentialFromError(error);

    // ...
  });
})

// ============ Sign UP UP UP with email and password ============
document.getElementById('signUpBtn').addEventListener('click', (e) => {
  e.preventDefault();

  const userEmail = document.getElementById('emailUser').value;
  const userPassword = document.getElementById('passwordUser').value;

  // createUserWithEmailAndPassword(auth, userEmail, userPassword) 
  createUserWithEmailAndPassword(auth, userEmail, userPassword).then((cred) => {
      setDoc(doc(usersCollectionRef, cred.user.uid), {
        full_name: document.getElementById('fName').value,
        city: document.getElementById('city').value,
        postal_code: document.getElementById('postalCode').value,
        phone_number: document.getElementById('phoneNumber').value,
        uid: cred.user.uid
      }).then(() => {
        console.log('User Created');
        window.location.href  = "login-account.html"

      });
  })

  .catch((err) => {
    console.log(err.code)
    console.log(err.message)
  })
})









