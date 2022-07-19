////////////////// IMPORTS //////////////////
import { readSessionUserData } from "./session-storage.js";
import { auth, db, storage } from "./firebase-init.js";
import { CLIENTS_COLLECTION_REFERENCE, ARTISTS_COLLECTION_REFERENCE, REQUEST_APPOINTMENTS_COLLECTION_REFERENCE } from "./firestore-references.js";
import { addDoc, doc, setDoc, getDoc, getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-storage.js";
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js';


////////////////// GLOBAL VARIABLES //////////////////

const sendForm = document.getElementById('appointment_planner');
const resoArray = [];
// let camBtn = document.getElementById('startCam');
let video = document.getElementById('video');
let canvas = document.getElementById('canvas');


////////////////// CLASSES //////////////////

class ClientReso {
  constructor(artist_name, placement, size, allergies, description, color, file, photo, date_time, userUID) {
    this.artist_name = artist_name;
    this.placement = placement;
    this.size = size;
    this.allergies = allergies;
    this.description = description;
    this.color = color;
    this.file = file;
    this.photo = photo;
    this.date_time = date_time;
    this.userUID = userUID;
  }
}

////////////////// FUNCTIONS //////////////////

//users function


// function readSessionUserData() {
//   if (sessionUser!=null) {

//   }
// }

//Blob function
function handleBlob(blob) {

  const objectURL = window.URL.createObjectURL(blob);
  console.log('ObjectURL:', objectURL);
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    console.log('Base64:', reader.result);
    document.getElementById('image').value = reader.result;
  });
  reader.readAsDataURL(blob);
}

//Show and hide camera function
let taker = true
function showCamera(taker) {
  if (taker==true) {
    document.getElementById('takePhoto').style.display = "flex";
    document.getElementById('video').style.display = "flex";
    document.getElementById('canvas').style.display = "flex";
    document.getElementById('stopCam').style.display = "flex";
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

//Queries////////////
/////////Pull artist from DB
const artistsQuerySnapshot = await getDocs(collection(db, "artists"));

artistsQuerySnapshot.forEach((doc) => {
  console.log(doc.id, " => ", doc.data());

  const artists = doc.data();
  console.log(artists.full_name)

  artistsListOutput.innerHTML +=
    `
            <div>
                <select>
                    <option>
                    ${artists.full_name}
                    </option>
                </select>
            </div>
        `
})

////////////////// EVENTS //////////////////

//Start camera
document.getElementById('camBtn').addEventListener('click', async function() {
  let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false});
  video.srcObject = stream;

  showCamera(true)
});

//Take photo
document.getElementById('takePhoto').addEventListener('click', function(){
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

  const appointmentPhoto = ref(storage, 'appointment-request-photo/images' + Date());

  const imageBlob = canvas.toBlob(handleBlob, "image/jpeg");

  uploadBytes(appointmentPhoto, imageBlob).then((snapshot) => {
      console.log('uploaded a blob');
   })
});

//Stop camera
document.getElementById('stopCam').addEventListener('click', () => {
  const tracks = video.srcObject.getTracks();
  tracks.forEach((track) => track.stop());

  showCamera(false);
});

// book with current user
const storegeRef = ref(storage, 'appointments-img/' + Date());
// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     console.log('user logged in', user)
    

sendForm.addEventListener('submit', function(e){
      e.preventDefault();

      const artist_name = document.getElementById('artistsListOutput').value;
      const placement = document.getElementById('placement').value;
      const size = document.getElementById('size').value;
      const allergies = document.getElementById('allergies-health').value;
      const description = document.getElementById('short-description').value;
      const color = document.getElementById('color').value;
      const date_time = document.getElementById('timePicker').value;
      const file = document.getElementById('choosePicture').files[0];
      const photo = document.getElementById('image').value
      const userUID = readSessionUserData('sessionUser').uid;

      const clientReso = new ClientReso (artist_name, placement, size, allergies, description, color, date_time, file, photo, userUID)

      resoArray.push(clientReso);
      console.log(clientReso);
      console.info(clientReso.toString());

      const storegeRef = ref(storage, 'appointments-img/' + Date());


      // send appoint data request  
      setDoc(doc(REQUEST_APPOINTMENTS_COLLECTION_REFERENCE), {
        artist_name: document.getElementById('artistsListOutput').value,
        placement: document.getElementById('placement').value,
        size: document.getElementById('size').value,
        allergies: document.getElementById('allergies-health').value,
        description: document.getElementById('short-description').value,
        color: document.getElementById('color').value,
        date_time: document.getElementById('timePicker').value,
        file: document.getElementById('choosePicture').value,
        photo: document.getElementById('image').value,
        userUID: readSessionUserData('sessionUser').uid,

      }).then((docRef) => {
        uploadBytes(storegeRef, file).then((snapshot) => {
          console.log(snapshot);
        });

        console.log(docRef.id)
      })
    })
//   } 
//   else {
//     console.log('User logged out. Need to be logged in to request an appointment');

//   }
// });



// this.artist_name = artist_name;
// this.placement = placement;
// this.size = size;
// this.allergies = allergies;
// this.description = description;
// this.color = color;
// this.file = file;
// this.photo = photo;
// this.date_time = date_time;











//Validate data
////////////////Disable past and current date
// const today = new Date().toISOString().split('T')[0];
// document.getElementsByName("timePicker")[0].setAttribute('min', today);






// requestBtn.addEventListener('click', (e) => {
//   e.preventDefault();

//   const userFile = document.getElementById('choosePicture').files[0];

//   // Create a reference to 'images/mountains.jpg'
//   // const storegeRef = ref(storage, 'appointments-img/' + user.email + user.uid);


//   // send appoint data request  
//   setDoc(doc(REQUEST_APPOINTMENTS_COLLECTION_REFERENCE), {
//     artist: document.getElementById('artistsListOutput').value,
//     placement: document.getElementById('placement').value,
//     size: document.getElementById('size').value,
//     allergies: document.getElementById('allergies-health').value,
//     description: document.getElementById('short-description').value,
//     color: document.getElementById('color').value,
//     date: document.getElementById('timePicker').value,
//     // time: document.getElementById('timePicker').value,
//     // photo_name: userFile.name,
//     uid: user.uid

//   }).then((docRef) => {
//     // uploadBytes(storegeRef, userFile).then((snapshot) => {
//     //   console.log(snapshot);
//     // });

//     console.log(docRef.id)
//   })
// })



// // ============ Current user request an appointment ==============
// onAuthStateChanged(auth, (user) => {
//   if (user) {

//     requestBtn.addEventListener('click', (e) => {
//       e.preventDefault();

//       const userFile = document.getElementById('choosePicture').files[0];

//       // Create a reference to 'images/mountains.jpg'
//       // const storegeRef = ref(storage, 'appointments-img/' + user.email + user.uid);


//       // send appoint data request  
//       setDoc(doc(requestAppointment), {
//         artist: document.getElementById('artistsListOutput').value,
//         placement: document.getElementById('placement').value,
//         size: document.getElementById('size').value,
//         allergies: document.getElementById('allergies-health').value,
//         description: document.getElementById('short-description').value,
//         color: document.getElementById('color').value,
//         date: document.getElementById('datePicker').value,
//         time: document.getElementById('timePicker').value,
//         // photo_name: userFile.name,
//         uid: user.uid

//       }).then((docRef) => {
//         // uploadBytes(storegeRef, userFile).then((snapshot) => {
//         //   console.log(snapshot);
//         // });

//         console.log(docRef.id)
//       })
//     })
//   } 
//   // else {
//   //   console.log('User logged out. Need to be logged in to request an appointment');

//   // }
// });






