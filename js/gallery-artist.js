import { auth, storage, db } from "./firebase-init.js";
import { ref, uploadBytes, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-storage.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, signInWithRedirect, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js';
import { collection, doc, getDoc, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";
import { storeSessionUserData, readSessionUserData } from "./session-storage.js";
import { CLIENTS_COLLECTION_REFERENCE, ARTISTS_COLLECTION_REFERENCE, REQUEST_APPOINTMENTS_COLLECTION_REFERENCE } from "./firestore-references.js";

/* ////////////////////////// VARIABLES ////////////////////////// */

const SESSION_USER_KEY_VALUE = "sessionUser";
const GALLERY_ID_KEY = "galleryId";

const ARTIST_COLLECTION = "artists";
const USER_PROFILE_COLLECTION = "user-profile";
const PROFILE_PICTURE_NAME = "profile.jpg";
const ARTIST_IMG_UPLOADS_COLLECTION = "artist-img-uploads"

const USER_TYPE_CLIENT = "client";
const USER_TYPE_ARTIST = "artist";

const PROFILE_IMAGE_ELEMENT = document.querySelector(".gallery-artist-profile-image");
const ARTIST_NAME_HTML_ELEMENT = document.querySelector(".artist-gallery-main-name-heading");
const ARTIST_BIO_HTML_ELEMENT = document.querySelector(".artist-gallery-main-artist-bio");
const ARTIST_GALLERY_HTML_ELEMENT = document.querySelector(".gallery-list");

const GALLERY_ID_VALUE = sessionStorage.getItem(GALLERY_ID_KEY);

/* ////////////////////////// CLASSES   ////////////////////////// */

class Artist {
    constructor(uid, name, bio) {
        this.uid = uid,
            this.name = name,
            this.bio = bio
    }
}


/* ////////////////////////// FUNCTIONS ////////////////////////// */

//ARTIST BUILDER

function buildArtistObject(artistObject) {
    return new Artist(artistObject.data().uid, artistObject.data().full_name, artistObject.data().bio);
}

//GET ARTIST INFORMATION
async function getArtistInformation(artistCollection, artistId) {
    const artistRef = doc(db, artistCollection, artistId);
    const artistDoc = await getDoc(artistRef);

    return buildArtistObject(artistDoc);

    // if (artistNameSnap.exists()) {
    //     console.log("Document data:", artistNameSnap.data().full_name);
    //     artistNameGallery.innerHTML = artistNameSnap.data().full_name
    // } else {
    //     // doc.data() will be undefined in this case
    //     console.log("No such document!");
    // }

}

//POPULATE ARTIST PROFILE
function populateArtistProfile(imageElement, artistObject) {
    const artistProfileRef = ref(storage, USER_PROFILE_COLLECTION + '/' + artistObject.uid + '/' + PROFILE_PICTURE_NAME);
    getDownloadURL(artistProfileRef)
        .then((url) => {
            imageElement.src = url;
        })
}

//POPULATE ARTIST INFO
function populateArtistInfo(nameElement, bioElement, artistObject) {
    nameElement.innerHTML = artistObject.name;
    bioElement.innerHTML = artistObject.bio;
}

//POPULATE ARTIST UPLOADED IMAGES
function populateArtistGallery(galleryElement, artistId) {
    const artistGalleryListRef = ref(storage, ARTIST_IMG_UPLOADS_COLLECTION + "/" + artistId);

    listAll(artistGalleryListRef)
        .then((res) => {
            res.items.forEach((itemRef) => {
                // console.log(itemRef._location.path_);
                const pathReference = ref(storage, itemRef._location.path_);
                getDownloadURL(pathReference)
                    .then((url) => {
                        galleryElement.innerHTML += `<img src='${url}' alt=''>`
                    });
            });
        });
}

//UPLOAD IMAGE
async function addImageToGallery() {
    //Store in Storage
    const userFile = document.getElementById('addImageArtist').files[0];
    const filename = readSessionUserData(SESSION_USER_KEY_VALUE).uid + "_" + Date.now() + '.jpg';
    const storegeRef = ref(storage, 'artist-img-uploads' + '/' + readSessionUserData(SESSION_USER_KEY_VALUE).uid + '/' + filename);

    uploadBytes(storegeRef, userFile)
        .then((snapshot) => {
            console.log(snapshot);
            console.log("Added");
        });


    //Store in Firestore
    const docRef = await addDoc(collection(db, ARTIST_IMG_UPLOADS_COLLECTION), {
        artist_name: readSessionUserData(SESSION_USER_KEY_VALUE).full_name,
        artist_id: readSessionUserData(SESSION_USER_KEY_VALUE).uid,
        img_name: filename
    });

    location.reload();
}


/* ////////////////////////// EVENTS    ////////////////////////// */

if(GALLERY_ID_VALUE !== null ){
    const artistInfo = await getArtistInformation(ARTIST_COLLECTION, GALLERY_ID_VALUE);

    populateArtistProfile(PROFILE_IMAGE_ELEMENT, artistInfo)
    
    populateArtistInfo(ARTIST_NAME_HTML_ELEMENT, ARTIST_BIO_HTML_ELEMENT, artistInfo);
    
    populateArtistGallery(ARTIST_GALLERY_HTML_ELEMENT, GALLERY_ID_VALUE);
}

else {
    const artistInfo = await getArtistInformation(ARTIST_COLLECTION, readSessionUserData(SESSION_USER_KEY_VALUE).uid);

    populateArtistProfile(PROFILE_IMAGE_ELEMENT, artistInfo)
    
    populateArtistInfo(ARTIST_NAME_HTML_ELEMENT, ARTIST_BIO_HTML_ELEMENT, artistInfo);
    
    populateArtistGallery(ARTIST_GALLERY_HTML_ELEMENT, artistInfo.uid);
}


// ARTIST-CLIENT USER CONDITIONAL

// ////// test

// if (GALLERY_ID_VALUE != readSessionUserData(SESSION_USER_KEY_VALUE).uid || readSessionUserData(SESSION_USER_KEY_VALUE).uid != GALLERY_ID_VALUE) {

//     const artistNameGallery = document.getElementById("btnAppointment");
//     artistNameGallery.innerHTML = `Book An Appointment`;

//     document.getElementById("btnAppointment").addEventListener('click', () => {
//         window.location.href = "../pages/book-appointment.html";
//     });

//     document.querySelector('.addButtons').style.display = 'none';

// } else if (readSessionUserData(SESSION_USER_KEY_VALUE).uid == GALLERY_ID_VALUE) {

//     const artistNameGallery = document.getElementById("btnAppointment");
//     artistNameGallery.innerHTML = `Manage Bookings`;

//     document.getElementById("btnAppointment").addEventListener('click', () => {
//         window.location.href = "../pages/appointment-management-artist.html";
//     });
// }

// document.getElementById('addImageArtist').addEventListener('click', function(){
//     const addImageMessage = document.getElementById('addImageMessage');
// addImageMessage.innerHTML = `To add more photos click on "Choose files" and then on "Add to Gallery".`
// })

// ///// end test


if (readSessionUserData(SESSION_USER_KEY_VALUE).user_type == USER_TYPE_ARTIST) {

    const artistNameGallery = document.getElementById("btnAppointment");
    artistNameGallery.innerHTML = `Manage Bookings`;

    document.getElementById("btnAppointment").addEventListener('click', () => {
        window.location.href = "../pages/appointment-management-artist.html";
    });

} else {
    const artistNameGallery = document.getElementById("btnAppointment");
    artistNameGallery.innerHTML = `Book An Appointment`;

    document.getElementById("btnAppointment").addEventListener('click', () => {
        window.location.href = "../pages/book-appointment.html";
    });

    document.querySelector('.addButtons').style.display = 'none';
}

document.getElementById('addImageArtist').addEventListener('click', function(){
    const addImageMessage = document.getElementById('addImageMessage');
addImageMessage.innerHTML = `To add more photos click on "Choose files" and then on "Add to Gallery".`
})

// Upload an image. Currently one by one
document.getElementById('addImageToGallery').addEventListener('click', async () => {
    addImageToGallery()
})





