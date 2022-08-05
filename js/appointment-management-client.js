////////////////// IMPORTS //////////////////
import { db, storage } from "./firebase-init.js";
import { REQUEST_APPOINTMENTS_COLLECTION_REFERENCE } from "./firestore-references.js";
import { addDoc, doc, setDoc, updateDoc, getDocs, collection, query, where, deleteDoc } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";
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
  constructor(id, photo, uploadedImageUrl, artist, placement, size, allergies, description, color, time, date, status) {
    this.id = id,
      this.photo = photo,
      this.uploadedImageUrl = uploadedImageUrl,
      this.artist = artist,
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
  return new Appointment(firebaseDocument.id, firebaseDocument.data().photo, firebaseDocument.data().uploadedImageUrl, firebaseDocument.data().artist, firebaseDocument.data().placement, firebaseDocument.data().size, firebaseDocument.data().allergies, firebaseDocument.data().description, firebaseDocument.data().color, firebaseDocument.data().time, firebaseDocument.data().date, firebaseDocument.data().status)
}

function loadAppointmentDetail(appointmentObject) {
  document.querySelector(".modal-content").id = appointmentObject.id;
  document.getElementById("modalContentHeaderTitleArtistName").innerHTML = appointmentObject.artist;
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

    artistElement = `<p>Artist: <span>${appointmentObject.artist}</span></p>`;
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

        artistElement = `<p>Artist: <span> ${appointmentObject.artist} </span></p>`;
        dateElement = `<p>Date: ${appointmentObject.date}</p>`;
        statusElement = `<p>Status: ${appointmentObject.status}</p>`;

        artistDateGrouping = `<div class="appointment-info">${artistElement + dateElement + statusElement}</div>`;

        // cardElement = `<button class="appointment-card-btn" id="${appointmentObject.id}">${thumbnailElement + artistDateGrouping}</button>`;

        document.getElementById(appointmentObject.id).innerHTML += thumbnailElement + artistDateGrouping;
        appointmentObject.uploadedImageUrl = url;
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

////////////////// EVENTS //////////////////

//Read Session Object
const sessionObject = readSessionUserData(SESSION_USER_KEY_VALUE);

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

//Edit Button
document.getElementById("modalContentBtnEdit").addEventListener('click', async (e) => {

  e.target.innerHTML = "Update";
  e.target.id = "modalContentBtnUpdate"
  document.querySelectorAll(".modal-input").forEach((input) => {
    input.disabled = false;
    input.classList.add("modal-input-enabled")
  });

  document.getElementById("modalContentBtnUpdate").addEventListener('click', async (e) => {

    const requestId = document.querySelector(".modal-content").id
  
    const appointmentToUpdateRef = doc(db, "request_appointment", requestId);
    await updateDoc(appointmentToUpdateRef, {
      placement: document.getElementById('modalPlacementInput').value,
      size: document.getElementById('modalSizeInput').value,
      allergies: document.getElementById('modalAllergiesInput').value,
      description: document.getElementById('modalDescriptionInput').value,
      color: document.getElementById('modalColorInput').value,
      // date: document.getElementById('datePicker').value,
      // time: document.getElementById('timePicker').value,
      // image: document.getElementById('image').value,
    })
    location.reload();
  })

})

// //Cancel Button
// document.getElementById("modalContentBtnCancel").addEventListener('click', (e) => {
//   modal.style.visibility = "hidden";
//   document.querySelectorAll(".modal-input").forEach((input) => {
//     input.disabled = true;
//     input.classList.remove("modal-input-enabled")
//   })
// })



////////////// Delete/Cancel Appointment ///////////////////////

// request appointment query
const appointmentsQuery = query(collection(db, 'request_appointment'), where('uid', '==', readSessionUserData(SESSION_USER_KEY_VALUE).uid));
const appointmentsSnapshot = await getDocs(appointmentsQuery);
console.log(appointmentsSnapshot)


appointmentsSnapshot.forEach((appoDoc) => {
  // console.log(appoDoc.data())
  // console.log(appoDoc.id)

  const appointmentDocId = appoDoc.id
  console.log(appointmentDocId)

  // delete appointment event 
  document.getElementById('modalContentBtnCancel').addEventListener('click', async (e) => {


    await deleteDoc(doc(db, "request_appointment", appointmentDocId), {
    })
    location.reload()
  })
})

/////////////////////////////////////////



























////////////// deleted because it was causing problems. so far everything is working normally if this event remains comented 
// ////Move to Create Appointments page
// document.getElementById('createAppoinmentBtn').addEventListener('click', () => {
//   window.location.href = "../pages/book-appointment.html";
// });



// //CAMERA
// // start camera
// document.getElementById(modalCam).addEventListener('click', async function() {
//   let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false});
//   video.srcObject = stream;

//   showCamera(true)
// });

// // stop camera
// document.getElementById('stopCam').addEventListener('click', () => {
//   const tracks = video.srcObject.getTracks();
//   tracks.forEach((track) => track.stop());

//   showCamera(false);
// });










