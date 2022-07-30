////////////////// IMPORTS //////////////////

import { db, storage } from "./firebase-init.js";
import { CLIENTS_COLLECTION_REFERENCE, ARTISTS_COLLECTION_REFERENCE, REQUEST_APPOINTMENTS_COLLECTION_REFERENCE } from "./firestore-references.js";
import { doc, addDoc, setDoc, getDoc, getDocs, updateDoc, query, collection, where } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";
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

createBtn.addEventListener('click', async (e) => {

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
    client: readSessionUserData(SESSION_USER_KEY_VALUE).full_name,
    placement: document.getElementById('placement').value,
    size: document.getElementById('size').value,
    allergies: document.getElementById('allergies-health').value,
    description: document.getElementById('short-description').value,
    color: document.getElementById('color').value,
    date: document.getElementById('datePicker').value,
    time: document.getElementById('timePicker').value,
    uid: readSessionUserData(SESSION_USER_KEY_VALUE).uid,
    photo: document.getElementById('book-appointment__photo-input').value,
    status: "pending"
  })

  const appointmentStoregeRef = ref(storage, 'appointments-img' + '/' + appointmentDoc.id);
  uploadBytes(appointmentStoregeRef, userFile)
    .then((snapshot) => {
      window.location.href = "../pages/appointment-management-client.html";
    });

  

});

///////////////////////////////// CAMERA /////////////////////////////////////////////

// variables
let camBtn = document.getElementById('startCam');
let video = document.getElementById('video');
let canvas = document.getElementById('canvas');

// start camera
camBtn.addEventListener('click', async function () {
  let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  video.srcObject = stream;

  showCamera(true)
});

// stop camera
document.getElementById('stopCam').addEventListener('click', () => {
  const tracks = video.srcObject.getTracks();
  tracks.forEach((track) => track.stop());

  showCamera(false);
});

// take photo
takePhoto.addEventListener('click', function () {
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

  const appointmentPhoto = ref(storage, 'appointment-request-photo/images' + Date());

  const imageBlob = canvas.toBlob(handleBlob, "image/jpeg");

  uploadBytes(appointmentPhoto, imageBlob).then((snapshot) => {
    console.log('uploaded a blob');
  })
});

// blob function
function handleBlob(blob) {

  const objectURL = window.URL.createObjectURL(blob);
  console.log('ObjectURL:', objectURL);
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    console.log('Base64:', reader.result);
    document.getElementById('book-appointment__photo-input').value = reader.result;
  });
  reader.readAsDataURL(blob);
}

// show and hide camera function
let taker = true
function showCamera(taker) {
  if (taker == true) {
    document.getElementById('takePhoto').style.display = "block";
    document.getElementById('video').style.display = "block";
    document.getElementById('canvas').style.display = "block";
    document.getElementById('stopCam').style.display = "block";
    // document.getElementById('uploadPhoto').style.display = "block";

    console.log('show camera')
  }
  else {
    document.getElementById('takePhoto').style.display = "none";
    document.getElementById('video').style.display = "none";
    document.getElementById('canvas').style.display = "none";
    document.getElementById('stopCam').style.display = "none";
    // document.getElementById('uploadPhoto').style.display = "none";

    console.log('close and hide camera')
  }
}
