import { auth, storage, db, provider, providerTwo, requestAppointment, usersCollectionRef, artistsCollectionRef  } from "./main.js";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, onAuthStateChanged   } from 'https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js';
import { addDoc, doc, setDoc, getDoc, getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-storage.js";

// Variables
let userUID = "";

function drawNewTableRow(artistName, appoinmentDate, row){
  let artist = row.insertCell(0);
  let date = row.insertCell(1);

// table info
  artist.innerHTML = `<p>${artistName}</p>`;
  date.innerHTML = `<p>${appoinmentDate}</p>`; 
}

async function updateTable(collectionName) {
  // Table name
  myAppointmentUser.innerHTML = "";

  // Query
  const appointmentsUserQuery = query(collection(db, "request_appointment"), where("uid", "==", "50QeZJOwCoc4e4lwKfeUjOyv9CD3"));
  

  const userAppointments = await getDocs(appointmentsUserQuery);
  userAppointments.forEach((doc) => {
    drawNewTableRow(doc.data().artist, doc.data().date, myAppointmentUser.insertRow(0))
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log(user.uid);
    userUID = user.uid;
  } else {
    console.log('user logged out');
  }
});

updateTable("request_appointment");




// OLD CODE SHOWING ALL USERS APPOINTMENTS


// // ===================== GET CURRENT USER =======================
// onAuthStateChanged(auth, (user) => {
//     if (user) {
//       console.log('user logged in', user)

//     //  document.getElementById('myAppoinmentsUserBtn').addEventListener('click', () => {

//     //     window.location.href  = "my-appoinments-user.html"

//     // }).then(() => {
//     //     console.log('hello')
//     // })
       
//     } else {
//       console.log('user logged out');
//     }
//   });


// // get all appointments requested
// const querySnapshot = await getDocs(collection(db, "request_appointment"));
// querySnapshot.forEach((doc) => {

//     console.log(doc.id, " => ", doc.data());

//     const appointments = doc.data();
//     console.log(appointments.artist)
//     //   console.log(appointments.(user.name))

//     myAppointmentUser.innerHTML += 
//     `
//     Artist: ${appointments.artist} Date: ${appointments.date}
//     `
// })

// // // get all artists names
// // const artistsQuerySnapshot = await getDocs(collection(db, "artists"));
// //   artistsQuerySnapshot.forEach((doc) => {
      
// //   console.log(doc.id, " => ", doc.data());

// //   const artists = doc.data();
// //   console.log(artists.full_name)

// // })






