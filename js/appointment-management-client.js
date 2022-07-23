////////////////// IMPORTS //////////////////
import { db, storage } from "./firebase-init.js";
import { CLIENTS_COLLECTION_REFERENCE, ARTISTS_COLLECTION_REFERENCE } from "./firestore-references.js";
import { addDoc, doc, setDoc, getDoc, getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-storage.js";

import { readSessionUserData } from "./session-storage.js";

////////////////// VARIABLES AND CONSTANTS //////////////////

let modal = document.getElementById("myModal");

// Get the button that opens the modal
let btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];

const COLLECTION_NAME = "request_appointment";
const SESSION_USER_KEY_VALUE = "sessionUser";

const UID_FIELD = "uid";

const STORAGE_FOLDER = "/appointments-img"

////////////////// FUNCTIONS //////////////////


function myName() {
  console.log("hello hello");
}

//Function to draw Rows in the table with the data from Firestore
function drawAppointmentCard(photoName, imageName, artistName, appoinmentDate, container) {
  // let thumbnail = row.insertCell(0);
  // let artist = row.insertCell(1);
  // let date = row.insertCell(2);

  
  let thumbnailElement;
  let artistElement;
  let dateElement;
  let artistDateGrouping;
  let cardElement;

  if (photoName !== ""){
    thumbnailElement = `<img src='${photoName}' class="thumbnail-image"></img>`;

    artistElement = `<p>Appointment with: ${artistName}</p>`;
    dateElement = `<p>Date: ${appoinmentDate}</p>`;

    artistDateGrouping = `<div class="appointment-info">${artistElement + dateElement}</div>`;

    cardElement = `<button class="appointment-card-btn" >${thumbnailElement + artistDateGrouping}</button>`;

    container.innerHTML += cardElement;

  }

  else {
      //Thumbnail call
  const thumbnailRef = ref(storage, STORAGE_FOLDER + '/' + imageName);
  getDownloadURL(thumbnailRef)
    .then((url) => {
      // thumbnail.innerHTML += `<img src='${url}' class="thumbnail-image"></img>`;
      thumbnailElement = `<img src='${url}' class="thumbnail-image"></img>`;

      artistElement = `<p>Appointment with: ${artistName}</p>`;
      dateElement = `<p>Date: ${appoinmentDate}</p>`;

      artistDateGrouping = `<div class="appointment-info">${artistElement + dateElement}</div>`;

      cardElement = `<button class="appointment-card-btn">${thumbnailElement + artistDateGrouping}</button>`;

      container.innerHTML += cardElement;
    })
  }

}

async function updateAppointmentList(collectionName, sessionUserUID) {

  // Query
  const appointmentsUserQuery = query(collection(db, collectionName), where(UID_FIELD, "==", sessionUserUID));
  const userAppointments = await getDocs(appointmentsUserQuery);
  userAppointments.forEach((doc) => {
    drawAppointmentCard(doc.data().image, doc.id, doc.data().artist, doc.data().date, document.getElementById('appointmentContainer'))
  });
}

////////////////// EVENTS //////////////////

// console.log(document.querySelectorAll(".buttonToTest"));

//Read Session Object
const sessionObject = readSessionUserData(SESSION_USER_KEY_VALUE);

//Update table with content
await updateAppointmentList(COLLECTION_NAME, sessionObject.uid);

document.querySelectorAll(".appointment-card-btn").forEach((button) => {

  button.addEventListener('click', () => {
    modal.style.visibility = "visible";
  })
})

////MODAL EVENTS

document.getElementById('closingX').addEventListener('click', () => {
  modal.style.visibility = "hidden";
})

// When the user clicks on <span> (x), close the modal
window.addEventListener('click', (event) => {
  if (event.target == modal) {
    modal.style.visibility = "hidden";
  }
})


//Move to Create Appointments page
document.getElementById('createAppoinmentBtn').addEventListener('click', () => {

  window.location.href = "../pages/book-appointment.html";
});










