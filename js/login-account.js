import { auth } from "./main.js";
import { signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js';


onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    // const uid = user.uid;
    console.log(user.uid);
    console.log(user.email);
    UserLoggedIn.innerHTML = `<h2>Profile</h2><p>Welcome ${user.email}`
    // ...
  } else {
    // User is signed out
    // ...
    console.log('user logout');
  }
});

const logout = document.getElementById('signOutBtn');
logout.addEventListener('click',(e) => {
  e.preventDefault();
  signOut(auth);

  window.location.href = "login.html"
})