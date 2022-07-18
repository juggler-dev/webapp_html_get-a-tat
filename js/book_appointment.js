////////////////// IMPORTS //////////////////

import { db, storage } from "./firebase-init.js";
import { CLIENTS_COLLECTION_REFERENCE, ARTISTS_COLLECTION_REFERENCE } from "./firestore-references.js";
import { addDoc, doc, setDoc, getDoc, getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-storage.js";

////////////////// GLOBAL VARIABLES //////////////////


////////////////// CLASSES //////////////////


////////////////// FUNCTIONS //////////////////


////////////////// EVENTS //////////////////

// Disable past and current date
const today = new Date().toISOString().split('T')[0];
document.getElementsByName("datePicker")[0].setAttribute('min', today);


requestBtn.addEventListener('click', (e) => {
  e.preventDefault();

  const userFile = document.getElementById('choosePicture').files[0];

  // Create a reference to 'images/mountains.jpg'
  // const storegeRef = ref(storage, 'appointments-img/' + user.email + user.uid);


  // send appoint data request  
  setDoc(doc(requestAppointment), {
    artist: document.getElementById('artistsListOutput').value,
    placement: document.getElementById('placement').value,
    size: document.getElementById('size').value,
    allergies: document.getElementById('allergies-health').value,
    description: document.getElementById('short-description').value,
    color: document.getElementById('color').value,
    date: document.getElementById('datePicker').value,
    time: document.getElementById('timePicker').value,
    // photo_name: userFile.name,
    uid: user.uid

  }).then((docRef) => {
    // uploadBytes(storegeRef, userFile).then((snapshot) => {
    //   console.log(snapshot);
    // });

    console.log(docRef.id)
  })
})


























// ============ Current user request an appointment ==============
onAuthStateChanged(auth, (user) => {
  if (user) {

    requestBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const userFile = document.getElementById('choosePicture').files[0];

      // Create a reference to 'images/mountains.jpg'
      // const storegeRef = ref(storage, 'appointments-img/' + user.email + user.uid);


      // send appoint data request  
      setDoc(doc(requestAppointment), {
        artist: document.getElementById('artistsListOutput').value,
        placement: document.getElementById('placement').value,
        size: document.getElementById('size').value,
        allergies: document.getElementById('allergies-health').value,
        description: document.getElementById('short-description').value,
        color: document.getElementById('color').value,
        date: document.getElementById('datePicker').value,
        time: document.getElementById('timePicker').value,
        // photo_name: userFile.name,
        uid: user.uid

      }).then((docRef) => {
        // uploadBytes(storegeRef, userFile).then((snapshot) => {
        //   console.log(snapshot);
        // });

        console.log(docRef.id)
      })
    })
  } 
  // else {
  //   console.log('User logged out. Need to be logged in to request an appointment');

  // }
});


//Pull artist from DB
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



