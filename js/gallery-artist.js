import { auth, storage, db } from "./firebase-init.js";
import { ref, uploadBytes, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-storage.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, signInWithRedirect, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js';
import { collection, doc, getDoc, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";
import { storeSessionUserData, readSessionUserData } from "./session-storage.js";
import { CLIENTS_COLLECTION_REFERENCE, ARTISTS_COLLECTION_REFERENCE, REQUEST_APPOINTMENTS_COLLECTION_REFERENCE } from "./firestore-references.js";


// Variables =====================
const SESSION_USER_KEY_VALUE = "sessionUser";

const USER_TYPE_CLIENT = "client";
const USER_TYPE_ARTIST = "artist";

//Get name artist
const artistNameRef = doc(db, "artists", `${readSessionUserData(SESSION_USER_KEY_VALUE).uid}`);
const artistNameSnap = await getDoc(artistNameRef);

if (artistNameSnap.exists()) {
  console.log("Document data:", artistNameSnap.data().full_name);
  artistNameGallery.innerHTML = artistNameSnap.data().full_name
} else {
  // doc.data() will be undefined in this case
  console.log("No such document!");
}

// //Option 2. Get user name of artist logged in. No specific page for artist so far
// if (readSessionUserData(SESSION_USER_KEY_VALUE).user_type == "artist"){
  
//       const artistNameGallery = document.getElementById("artistNameGallery");
//       artistNameGallery.innerHTML = readSessionUserData(SESSION_USER_KEY_VALUE).full_name;

// }

//Get bio from artist
const artistBioRef = doc(db, "artists", `${readSessionUserData(SESSION_USER_KEY_VALUE).uid}`);
const artistBioSnap = await getDoc(artistBioRef);

if (artistBioSnap.exists()) {
  console.log("Document data:", artistBioSnap.data().bio);
  printBio.innerHTML = artistBioSnap.data().bio
} else {
  // doc.data() will be undefined in this case
  console.log("No such document!");
}

// Control functions as an artist
if (readSessionUserData(SESSION_USER_KEY_VALUE).user_type == "artist"){
  
    const artistNameGallery = document.getElementById("btnAppointment");
    artistNameGallery.innerHTML = `Manage Appointment`;

    document.getElementById("btnAppointment").addEventListener('click', () => {
        window.location.href = "../pages/appointment-management-artist.html";
    });

// View gallery page as a client
} else {
    const artistNameGallery = document.getElementById("btnAppointment");
    artistNameGallery.innerHTML = `Book Appointment`;

    document.querySelector('.addButtons').style.display = 'none';
}

// Upload an image. Currently one by one
document.getElementById('addImageToGallery').addEventListener('click', async () => {

    //Store in Storage
    const userFile = document.getElementById('addImageArtist').files[0];
    const filename = Date() + '.png';
    const storegeRef = ref(storage, 'artist-img-uploads' + '/' + `${readSessionUserData(SESSION_USER_KEY_VALUE).uid}` + '/' + filename);

    uploadBytes(storegeRef, userFile)
        .then((snapshot) => {
            console.log(snapshot);
        });

    console.log("Added");

    //Store in Firestore
    const docRef = await addDoc(collection(db, "artist_img_uploads"), {
        artist_id: readSessionUserData(SESSION_USER_KEY_VALUE).uid,
        img_name: filename
    });
    // updateTable("artist_img_uploads");

})

//Get artist images uploaded. it's necessary refresh page to display pictures
const artistGalleryListRef = ref(storage, `artist-img-uploads/${readSessionUserData(SESSION_USER_KEY_VALUE).uid}`);    

listAll(artistGalleryListRef)
    .then((res) => {
        res.items.forEach((itemRef) => {
            console.log(itemRef._location.path_);
            const pathReference = ref(storage, `${itemRef._location.path_}`
        );
    getDownloadURL(pathReference)
        .then((url) => {
            photoGallery.innerHTML += `<img src='${url}' alt=''>`
        });
    });
});

