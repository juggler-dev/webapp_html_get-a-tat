////////////////// IMPORTS //////////////////

import { db, storage } from "./firebase-init.js";
import { CLIENTS_COLLECTION_REFERENCE, ARTISTS_COLLECTION_REFERENCE, REQUEST_APPOINTMENTS_COLLECTION_REFERENCE } from "./firestore-references.js";
import { doc, addDoc, setDoc, getDoc, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-storage.js";

import { readSessionUserData } from "./session-storage.js";

////////////////// GLOBAL VARIABLES //////////////////

const SESSION_USER_KEY_VALUE = "sessionUser";

////////////////// CLASSES //////////////////

class Appointment {

  constructor(artist, placement, size, allergies, description, color, date, time, uid) {
    this.artist = artist,
      this.placement = placement,
      this.size = size,
      this.allergies = allergies,
      this.description = description,
      this.color = color,
      this.date = date,
      this.time = time,
      this.uid = uid
  }

}

////////////////// FUNCTIONS //////////////////

function createNewAppointment(artist, placement, size, allergies, description, color, date, time, uid) {
  return new Appointment(artist, placement, size, allergies, description, color, date, time, uid);
}

////////////////// EVENTS //////////////////

// Disable past and current date ??????????????????
const today = new Date().toISOString().split('T')[0];
document.getElementsByName("timePicker")[0].setAttribute('min', today);

//Get all artists from DB
const artists = await getDocs(ARTISTS_COLLECTION_REFERENCE);
artists.forEach((artist) => {

  artistsListOutput.innerHTML += `<div><select><option>${artist.data().full_name}</option></select></div>`
})

requestBtn.addEventListener('click', async (e) => {

  // Prevent form refresh
  e.preventDefault();

  // Value of picture loaded
  const userFile = document.getElementById('choosePicture').files[0];

  // Upload appointment request data to Firestore


  ////////////////////////////////==========================================IN REVISION
  // createNewAppointment(
  //   document.getElementById('artistsListOutput').value,
  //   document.getElementById('placement').value,
  //   document.getElementById('size').value,
  //   document.getElementById('allergies-health').value,
  //   document.getElementById('short-description').value,
  //   document.getElementById('color').value,
  //   document.getElementById('datePicker').value,
  //   document.getElementById('timePicker').value,
  //   // userFile.name,
  //   readSessionUserData(SESSION_USER_KEY_VALUE).uid
  // )
  ////////////////////////////////==========================================IN REVISION

  const appointmentDoc = await addDoc(REQUEST_APPOINTMENTS_COLLECTION_REFERENCE, {
    artist: document.getElementById('artistsListOutput').value,
    placement: document.getElementById('placement').value,
    size: document.getElementById('size').value,
    allergies: document.getElementById('allergies-health').value,
    description: document.getElementById('short-description').value,
    color: document.getElementById('color').value,
    date: document.getElementById('datePicker').value,
    time: document.getElementById('timePicker').value,
    // photo_name: "testeo",
    uid: readSessionUserData(SESSION_USER_KEY_VALUE).uid
  })

  const appointmentStoregeRef = ref(storage, 'appointments-img' + '/' + appointmentDoc.id);
  uploadBytes(appointmentStoregeRef, userFile)
    .then((snapshot) => {
      console.log(snapshot);
    });

  console.log("Added appointment" + " " + appointmentDoc.id)

});