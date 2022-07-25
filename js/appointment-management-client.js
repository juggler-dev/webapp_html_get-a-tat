////////////////// IMPORTS //////////////////
import { db, storage } from "./firebase-init.js";
import { REQUEST_APPOINTMENTS_COLLECTION_REFERENCE } from "./firestore-references.js";
import { addDoc, doc, setDoc, updateDoc, getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-storage.js";

import { readSessionUserData } from "./session-storage.js";

////////////////// VARIABLES AND CONSTANTS //////////////////

let bookingArray = [];

let modal = document.getElementById("myModal");

// Get the button that opens the modal
let btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];

const COLLECTION_NAME = "request_appointment";
const SESSION_USER_KEY_VALUE = "sessionUser";

const UID_FIELD = "uid";

const STORAGE_FOLDER = "/appointments-img"

const APPOINTMENT_BUTTON_CLASS = ".appointment-card-btn"

////////////////// CLASSES //////////////////

class Appointment {
  constructor(id, image, artist, placement, size, allergies, description, color, date) {
    this.id = id,
      this.image = image,
      this.artist = artist,
      this.placement = placement,
      this.size = size,
      this.allergies = allergies,
      this.description = description,
      this.color = color,
      this.date = date
  }
}

////////////////// FUNCTIONS //////////////////

function buildAppointment(firebaseDocument) {
  return new Appointment(firebaseDocument.id, firebaseDocument.data().image, firebaseDocument.data().artist, firebaseDocument.data().placement, firebaseDocument.data().size, firebaseDocument.data().allergies, firebaseDocument.data().description, firebaseDocument.data().color, firebaseDocument.data().date)
}

function loadAppointmentDetail(appointmentObject) {
  document.getElementById("modalPlacementInput").value = appointmentObject.placement;
  console.log('??')
  document.getElementById("modalSizeInput").value = appointmentObject.size;
  document.getElementById("modalAllergiesInput").value = appointmentObject.allergies;
  // // document.getElementById("modalDescriptionInput").value = appointmentObject.description;
  // document.getElementById("modalColorInput").value = appointmentObject.color;
  // document.getElementById("modalImageReference").src = appointmentObject.placement;
}

// async function retrieveAppointmentsFromFirestore(collectionName, sessionUserUID) {
//   // Query
//   const appointmentsUserQuery = query(collection(db, collectionName), where(UID_FIELD, "==", sessionUserUID));
//   const userAppointments = await getDocs(appointmentsUserQuery);
//   userAppointments.forEach((doc) => {

//     const appointmentObject = buildAppointment(doc);
//     bookingArray.push(appointmentObject);
//   });
// }

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
  let artistDateGrouping;

  if (appointmentObject.image !== "") {
    container.innerHTML += `<button class="appointment-card-btn" id="${appointmentObject.id}"></button>`;

    thumbnailElement = `<img src='${appointmentObject.image}' class="thumbnail-image"></img>`;

    artistElement = `<p>Appointment with: ${appointmentObject.artist}</p>`;
    dateElement = `<p>Date: ${appointmentObject.date}</p>`;

    artistDateGrouping = `<div class="appointment-info">${artistElement + dateElement}</div>`;

    document.getElementById(appointmentObject.id).innerHTML += thumbnailElement + artistDateGrouping;

  }

  else {

    container.innerHTML += `<button class="appointment-card-btn" id="${appointmentObject.id}"></button>`;

    //Thumbnail call
    const thumbnailRef = ref(storage, STORAGE_FOLDER + '/' + appointmentObject.id);
    getDownloadURL(thumbnailRef)
      .then((url) => {
        thumbnailElement = `<img src='${url}' class="thumbnail-image"></img>`;

        artistElement = `<p>Appointment with: ${appointmentObject.artist}</p>`;
        dateElement = `<p>Date: ${appointmentObject.date}</p>`;

        artistDateGrouping = `<div class="appointment-info">${artistElement + dateElement}</div>`;

        // cardElement = `<button class="appointment-card-btn" id="${appointmentObject.id}">${thumbnailElement + artistDateGrouping}</button>`;

        document.getElementById(appointmentObject.id).innerHTML += thumbnailElement + artistDateGrouping;
      })
  }

}

async function updateAppointmentList(collectionName, sessionUserUID) {

  // Query
  const appointmentsUserQuery = query(collection(db, collectionName), where(UID_FIELD, "==", sessionUserUID));
  const userAppointments = await getDocs(appointmentsUserQuery);
  userAppointments.forEach((doc) => {

    const appointmentObject = buildAppointment(doc);
    bookingArray.push(appointmentObject);
    drawAppointmentCard(appointmentObject, document.getElementById('appointmentContainer'));
  });
}

function renderTable() {

}

////////////////// EVENTS //////////////////

//Read Session Object
const sessionObject = readSessionUserData(SESSION_USER_KEY_VALUE);

// //Pull all appointments from Firebase.
// await retrieveAppointmentsFromFirestore(COLLECTION_NAME, sessionObject.uid);

//Update table with content
await updateAppointmentList(COLLECTION_NAME, sessionObject.uid);

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

// // When the user clicks on <span> (x), close the modal
// window.addEventListener('click', (event) => {
//   if (event.target == modal) {
//     modal.style.visibility = "hidden";
//   }
// })

//Edit Button
document.getElementById("modalContentBtnEdit").addEventListener('click', async (e) => {

  // e.target.innerHTML = "Update";
  document.querySelectorAll(".modal-input").forEach((input) => {
    input.disabled = false;
    input.classList.add("modal-input-enabled")
  });


})

//Update Button
document.getElementById("modalContentBtnUpdate").addEventListener('click', async (e) => {


  const appointmentToUpdateRef = doc(db, "request_appointment", "rhSdLpG5VKWwH0KXisDp");
  await updateDoc(appointmentToUpdateRef, {
    placement: document.getElementById('modalPlacementInput').value,
    size: document.getElementById('modalSizeInput').value,
    allergies: document.getElementById('modalAllergiesInput').value
    // description: document.getElementById('short-description').value,
    // color: document.getElementById('color').value,
    // date: document.getElementById('datePicker').value,
    // time: document.getElementById('timePicker').value,
    // uid: readSessionUserData(SESSION_USER_KEY_VALUE).uid,
    // image: document.getElementById('image').value,
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

////Move to Create Appointments page
document.getElementById('createAppoinmentBtn').addEventListener('click', () => {
  window.location.href = "../pages/book-appointment.html";
});










