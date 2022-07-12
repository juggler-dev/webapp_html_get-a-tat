import { auth, provider, providerTwo  } from "./main.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, signInWithRedirect, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js';

// ===================== GET CURRENT USER =======================
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    // const uid = user.uid;
    console.log('user logged in', user)
    // console.log(user.uid);
    // console.log(user.email);
   

    // ...
  } else {
    // User is signed out
    // ...

    console.log('user logged out');

  }
});

// ==================== NEW SIGN IN - EMAIL/PASSWORD =======================

document.getElementById('signInBtn').addEventListener('click', () => {

  const userEmail = document.getElementById('emailUser').value;
  const userPassword = document.getElementById('passwordUser').value;

  signInWithEmailAndPassword(auth, userEmail, userPassword).then(cred => {
    console.log(cred.user)
    window.location.href  = "home-user.html"

    })
    .catch((err) => {
      console.log(err.code)
      console.log(err.message)
    })   
})

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


// // ==================== OLD SIGN IN - EMAIL/PASSWORD =======================
// document.getElementById('signInBtn').addEventListener('click', () => {

//   const userEmail = document.getElementById('emailUser').value;
//   const userPassword = document.getElementById('passwordUser').value;

//   signInWithEmailAndPassword(auth, userEmail, userPassword)

//     .then((res) => {
//       console.log(res.user)
//       // localStorage.setItem('test', `
//       // UID: ${res.user.uid}
//       // EMAIL: ${res.user.email}`);
//       // console.log(localStorage.getItem('test') );
//       // console.log(`${res.user.email} you're logged in`);
//       window.location.href  = "login-account.html"

//       // document.getElementByIdloginOutput.innerHTML = `<h1>hello</h1>`
//       // getUserLog() = user;
     
//     })
//     .catch((err) => {
//       console.log(err.code)
//       console.log(err.message)

//     })   
// })