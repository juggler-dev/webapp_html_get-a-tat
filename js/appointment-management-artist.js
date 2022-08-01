import { db, storage } from "./firebase-init.js";
import { CLIENTS_COLLECTION_REFERENCE, ARTISTS_COLLECTION_REFERENCE } from "./firestore-references.js";
import { collection, doc, getDoc, updateDoc, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-storage.js";

import { readSessionUserData } from "./session-storage.js";

////////////////// VARIABLES AND CONSTANTS //////////////////

let bookingArray = [];

let modal = document.getElementById("myModal");

const COLLECTION_NAME = "request_appointment";
const SESSION_USER_KEY_VALUE = "sessionUser";

const ARTIST_NAME_FIELD = "artist";

const STORAGE_FOLDER = "/appointments-img"

const APPOINTMENT_BUTTON_CLASS = ".appointment-card-btn"

////////////////// CLASSES //////////////////

class Appointment {
  constructor(id, photo, uploadedImageUrl, artist, client, placement, size, allergies, description, color, time, date, status) {
    this.id = id,
      this.photo = photo,
      this.uploadedImageUrl = uploadedImageUrl,
      this.artist = artist,
      this.client = client,
      this.placement = placement,
      this.size = size,
      this.allergies = allergies,
      this.description = description,
      this.color = color,
      this.time = time,
      this.date = date,
      this.status = status
  }
}
////////////////// FUNCTIONS //////////////////

function buildAppointment(firebaseDocument) {
  return new Appointment(firebaseDocument.id, firebaseDocument.data().photo, firebaseDocument.data().uploadedImageUrl, firebaseDocument.data().artist, firebaseDocument.data().client, firebaseDocument.data().placement, firebaseDocument.data().size, firebaseDocument.data().allergies, firebaseDocument.data().description, firebaseDocument.data().color, firebaseDocument.data().time, firebaseDocument.data().date, firebaseDocument.data().status)
}

function loadAppointmentDetail(appointmentObject) {
  document.querySelector(".modal-content").id = appointmentObject.id;
  document.getElementById("modalContentHeaderTitleClientName").innerHTML = appointmentObject.client;
  document.getElementById("modalPlacementInput").value = appointmentObject.placement;
  document.getElementById("modalSizeInput").value = appointmentObject.size;
  document.getElementById("modalAllergiesInput").value = appointmentObject.allergies;
  document.getElementById("modalDescriptionInput").value = appointmentObject.description;
  document.getElementById("modalColorInput").value = appointmentObject.color;
  if (appointmentObject.photo !== "") {
    document.getElementById("modalImageReference").src = appointmentObject.photo;
  }
  else {
    document.getElementById("modalImageReference").src = appointmentObject.uploadedImageUrl;
  }
  document.getElementById("modalContentTime").innerHTML = appointmentObject.time;
  document.getElementById("modalContentDate").innerHTML = appointmentObject.date;

}

function setButtonsEvents(querySelectorClass) {

  document.querySelectorAll(querySelectorClass).forEach((button) => {
    button.addEventListener('click', (e) => {
      loadAppointmentDetail(bookingArray.find(appointment => appointment.id === e.target.id))
      modal.style.visibility = "visible";
      document.querySelector(".content").style.overflow = "hidden";
    })
  });
}

//Function to draw Rows in the table with the data from Firestore
function drawAppointmentCard(appointmentObject, container) {

  let thumbnailElement;
  let artistElement;
  let dateElement;
  let statusElement;
  let artistDateGrouping;

  if (appointmentObject.photo !== "") {
    container.innerHTML += `<button class="appointment-card-btn" id="${appointmentObject.id}"></button>`;

    thumbnailElement = `<img src='${appointmentObject.photo}' class="thumbnail-image"></img>`;

    artistElement = `<p>Client: <span>${appointmentObject.artist}</span></p>`;
    dateElement = `<p>Date: ${appointmentObject.date}</p>`;
    statusElement = `<p>Status: ${appointmentObject.status}</p>`;

    artistDateGrouping = `<div class="appointment-info">${artistElement + dateElement + statusElement}</div>`;

    document.getElementById(appointmentObject.id).innerHTML += thumbnailElement + artistDateGrouping;

  }

  else {

    container.innerHTML += `<button class="appointment-card-btn" id="${appointmentObject.id}"></button>`;

    //Thumbnail call
    const thumbnailRef = ref(storage, STORAGE_FOLDER + '/' + appointmentObject.id);
    getDownloadURL(thumbnailRef)
      .then((url) => {
        thumbnailElement = `<img src='${url}' class="thumbnail-image"></img>`;

        artistElement = `<p>Client: ${appointmentObject.artist}</p>`;
        dateElement = `<p>Date: ${appointmentObject.date}</p>`;
        statusElement = `<p>Status: ${appointmentObject.status}</p>`;

        artistDateGrouping = `<div class="appointment-info">${artistElement + dateElement + statusElement}</div>`;

        // cardElement = `<button class="appointment-card-btn" id="${appointmentObject.id}">${thumbnailElement + artistDateGrouping}</button>`;

        document.getElementById(appointmentObject.id).innerHTML += thumbnailElement + artistDateGrouping;
        appointmentObject.uploadedImageUrl = url;
      })
  }

}

async function updateAppointmentList(collectionName, sessionArtistName) {

  // Query
  const appointmentsUserQuery = query(collection(db, collectionName), where(ARTIST_NAME_FIELD, "==", sessionArtistName));
  const userAppointments = await getDocs(appointmentsUserQuery);
  userAppointments.forEach((doc) => {

    const appointmentObject = buildAppointment(doc);
    bookingArray.push(appointmentObject);
    drawAppointmentCard(appointmentObject, document.getElementById('appointmentContainer'));
  });
}

////////////////// EVENTS //////////////////

//Read Session Object
const sessionObject = readSessionUserData(SESSION_USER_KEY_VALUE);

//Update table with content
await updateAppointmentList(COLLECTION_NAME, sessionObject.full_name);

console.log(bookingArray);

//Sets click events to appointment buttons
setButtonsEvents(".appointment-card-btn");


////MODAL EVENTS
document.getElementById('modalContentForm').addEventListener('submit', (e) => {

  e.preventDefault();
})

document.getElementById('closingX').addEventListener('click', () => {
  modal.style.visibility = "hidden";
  document.querySelectorAll(".modal-input").forEach((input) => {
    input.disabled = true;
    input.classList.remove("modal-input-enabled")
  })
})

//Acept Button
document.getElementById("modalContentBtnAccept").addEventListener('click', async (e) => {

  const requestId = document.querySelector(".modal-content").id
  
  const appointmentToUpdateRef = doc(db, "request_appointment", requestId);
  await updateDoc(appointmentToUpdateRef, {
    status: "accepted"
  })
  location.reload();
})


//Cancel Button
document.getElementById("modalContentBtnCancel").addEventListener('click', (e) => {
  modal.style.visibility = "hidden";
  document.querySelectorAll(".modal-input").forEach((input) => {
    input.disabled = true;
    input.classList.remove("modal-input-enabled")
  })
})

// ////Move to Create Appointments page
// document.getElementById('createAppoinmentBtn').addEventListener('click', () => {
//   window.location.href = "../pages/book-appointment.html";
// });