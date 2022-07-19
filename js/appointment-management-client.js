////////////////// IMPORTS //////////////////
import { db, storage } from "./firebase-init.js";
import { CLIENTS_COLLECTION_REFERENCE, ARTISTS_COLLECTION_REFERENCE } from "./firestore-references.js";
import { addDoc, doc, setDoc, getDoc, getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-storage.js";

import { readSessionUserData } from "./session-storage.js";

////////////////// VARIABLES AND CONSTANTS //////////////////

const COLLECTION_NAME = "request_appointment";
const SESSION_USER_KEY_VALUE = "sessionUser";

const STORAGE_FOLDER = "/appointments-img"

////////////////// FUNCTIONS //////////////////







//Function to draw Rows in the table with the data from Firestore
function drawNewTableRow(imageName, artistName, appoinmentDate, row) {
  let thumbnail = row.insertCell(0);
  let artist = row.insertCell(1);
  let date = row.insertCell(2);

  //Thumbnail calling
  const thumbnailRef = ref(storage, STORAGE_FOLDER + '/' + imageName);
  getDownloadURL(thumbnailRef)
    .then((url) => {
      thumbnail.innerHTML += `<img src='${url}' class="thumbnail-image"></img>`
    })

  // table info
  artist.innerHTML += `<p>${artistName}</p>`;
  date.innerHTML += `<p>${appoinmentDate}</p>`;
}

async function updateTable(collectionName, sessionUserUID) {
  // Table name
  myAppointmentUser.innerHTML = "";

  // Query
  const appointmentsUserQuery = query(collection(db, collectionName), where("uid", "==", sessionUserUID));
  const userAppointments = await getDocs(appointmentsUserQuery);
  userAppointments.forEach((doc) => {
    drawNewTableRow(doc.id, doc.data().artist, doc.data().date, myAppointmentUser.insertRow(0))
  });
}

////////////////// EVENTS //////////////////

//Create Session Object
const sessionObject = readSessionUserData(SESSION_USER_KEY_VALUE);

//Pull information from Session Storage 
updateTable(COLLECTION_NAME, sessionObject.uid);


//Move to Create Appointments page
document.getElementById('createAppoinmentBtn').addEventListener('click', () => {

  window.location.href = "../pages/book-appointment.html";
});






