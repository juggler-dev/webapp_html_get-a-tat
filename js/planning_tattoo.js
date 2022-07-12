import { auth, db, provider, providerTwo, requestAppointment, usersCollectionRef, artistsCollectionRef  } from "./main.js";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, onAuthStateChanged   } from 'https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js';
import { addDoc, doc, setDoc, getDoc, } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";

// Disable past and current date
const today = new Date().toISOString().split('T')[0];
document.getElementsByName("datePicker")[0].setAttribute('min', today);


// artistsCollectionRef.get().then(snapshot => {
//     console.log(snapshot.docs);
// })




// const docRef = doc(db, "artists");
// const docSnap = await getDoc(docRef);

// if (docSnap.exists()) {
//     console.log("Document data:", docSnap.data(full_name));
// } else {
//     console.log("No such a document!");
// }

// getDoc(docSnap.data(artistsCollectionRef), {

// });




// ============ Current user request an appointment ==============
onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('user logged in', user)
 
      requestBtn.addEventListener('click', (e) => {
        e.preventDefault();
    
        setDoc(doc(requestAppointment), {
            placement: document.getElementById('placement').value,
            size: document.getElementById('size').value,
            allergies: document.getElementById('allergies-health').value,
            description: document.getElementById('short-description').value,
            color: document.getElementById('color').value,
            date: document.getElementById('datePicker').value,
            uid: user.uid
    
        }).then(() => {
            console.log('Request sent')
        })
    })
    } else {
      console.log('User logged out. Need to be logged in to request an appointment');
  
    }
  });



// Send request appointment
// const appPlanner = document.getElementById('appointment_planner') 

// requestBtn.addEventListener('click', (e) => {
//     e.preventDefault();

//     setDoc(doc(requestAppointment), {
//     // requestAppointment.addDoc({
//         placement: document.getElementById('placement').value,
//         size: document.getElementById('size').value,
//         allergies: document.getElementById('allergies-health').value,
//         description: document.getElementById('short-description').value,
//         // color: document.getElementById('colorOrNOt').value,
//         data: document.getElementById('datePicker').value,
//                   uid: auth.user.uid

//     }).then(() => {
//         console.log('request sent')
//     })




// })


// // ============ Sign UP UP UP with email and password ============
// document.getElementById('signUpBtn').addEventListener('click', (e) => {
//     e.preventDefault();
  
//     const userEmail = document.getElementById('emailUser').value;
//     const userPassword = document.getElementById('passwordUser').value;
  
//     // createUserWithEmailAndPassword(auth, userEmail, userPassword) 
//     createUserWithEmailAndPassword(auth, userEmail, userPassword).then((cred) => {
//         setDoc(doc(usersCollectionRef, cred.user.uid), {
//           full_name: document.getElementById('fName').value,
//           city: document.getElementById('city').value,
//           postal_code: document.getElementById('postalCode').value,
//           phone_number: document.getElementById('phoneNumber').value,
//           uid: cred.user.uid
//         }).then(() => {
//           console.log('User Created');
//           window.location.href  = "login-account.html"
  
//         });
//     })
  
//     .catch((err) => {
//       console.log(err.code)
//       console.log(err.message)
//     })
//   })



// // Get today's date in calendar
// Date.prototype.toDateInputValue = (function() {
//     const local = new Date(this);
//     local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
//     return local.toJSON().slice(0,10);
// });

// document.getElementById('datePicker').value = new Date().toDateInputValue();

