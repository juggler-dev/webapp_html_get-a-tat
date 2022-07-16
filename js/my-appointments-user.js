////////////////// IMPORTS //////////////////
import { auth, storage, db, provider, providerTwo, requestAppointment, usersCollectionRef, artistsCollectionRef } from "./main.js";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js';
import { addDoc, doc, setDoc, getDoc, getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-storage.js";

////////////////// VARIABLES AND CONSTANTS //////////////////

const COLLECTION_NAME = "request_appointment";
const SESSION_USER_KEY_VALUE = "sessionUser";

////////////////// FUNCTIONS //////////////////

//Function to transform the string from the Session Storage to Object
function parseSessionStorageStringToObject(keyValue) {
  return JSON.parse(sessionStorage.getItem(keyValue));
}

//Function to draw Rows in the table with the data from Firestore
function drawNewTableRow(artistName, appoinmentDate, row) {
  let artist = row.insertCell(0);
  let date = row.insertCell(1);

  // table info
  artist.innerHTML = `<p>${artistName}</p>`;
  date.innerHTML = `<p>${appoinmentDate}</p>`;
}

async function updateTable(collectionName, sessionUserUID) {
  // Table name
  myAppointmentUser.innerHTML = "";

  // Query
  const appointmentsUserQuery = query(collection(db, collectionName), where("uid", "==", sessionUserUID));
  const userAppointments = await getDocs(appointmentsUserQuery);
  userAppointments.forEach((doc) => {
    drawNewTableRow(doc.data().artist, doc.data().date, myAppointmentUser.insertRow(0))
  });
}

////////////////// EVENTS //////////////////

//Create Session Object
const sessionObject = parseSessionStorageStringToObject(SESSION_USER_KEY_VALUE);

//Pull information from Session Storage 
updateTable(COLLECTION_NAME, sessionObject.uid);


//Move to Create Appointments page
document.getElementById('createAppoinmentBtn').addEventListener('click', () => {

  window.location.href = "../pages/planning_tattoo.html";
});






