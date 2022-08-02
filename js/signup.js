////////////////// IMPORTS //////////////////

import { auth, db, storage } from "./firebase-init.js";
import {
  CLIENTS_COLLECTION_REFERENCE,
  ARTISTS_COLLECTION_REFERENCE
} from "./firestore-references.js";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js';
import { addDoc, doc, setDoc, getDoc, getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";

import { ref, uploadBytes } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-storage.js";

import { storeSessionUserData, readSessionUserData } from "./session-storage.js";

////////////////// GLOBAL VARIABLES //////////////////

const USER_TYPE_CLIENT = "client";
const USER_TYPE_ARTIST = "artist";
const SIGN_UP_CLIENT = "Sign Up - Client";
const SIGN_UP_ARTIST = "Sign Up - Artist";
const HOME_CLIENT = "home-client.html";
const HOME_ARTIST = "home-artist.html";

const SESSION_USER_KEY_VALUE = "sessionUser";

const SIGN_UP_CLIENT_PAGE_NAME = "Sign Up - Client";
const SIGN_UP_ARTIST_PAGE_NAME = "Sign Up - Artist";

const VIDEO_HTML_ELEMENT = document.getElementById('videoElement');
const CANVAS_HTML_ELEMENT = document.getElementById('canvasElement');
const START_CAM_BUTTON = document.getElementById("startCamBtn");
const STOP_CAM_BUTTON = document.getElementById('stopCamBtn');
const TAKE_PHOTO_BUTTON = document.getElementById('takePhotoBtn');

const USER_PROFILE_COLLECTION = "user-profile";
const PROFILE_PICTURE_NAME = "profile.jpg";

////////////////// CLASSES //////////////////

class SessionUser {
  constructor(user_type, full_name, email, phoneNumber, city, postalCode, uid) {
    this.user_type = user_type;
    this.full_name = full_name;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.city = city;
    this.postalCode = postalCode;
    this.uid = uid;
  }
}

////////////////// FUNCTIONS //////////////////

function createNewSessionUser(userType, full_name, email, phoneNumber, city, postalCode, uid) {
  return new SessionUser(userType, full_name, email, phoneNumber, city, postalCode, uid);
}

async function saveSessionUserDataOnSessionStorage(collection, sessionUserUid) {

  //Firestore Query
  const docRef = doc(db, collection, sessionUserUid);
  const docSnap = await getDoc(docRef);

  //Object creation
  const sessionUserObject = createNewSessionUser(
    docSnap.data().user_type,
    docSnap.data().full_name,
    docSnap.data().email,
    docSnap.data().phoneNumber,
    docSnap.data().city,
    docSnap.data().postalCode,
    docSnap.data().uid);

  //Data stored on SessionStorage
  storeSessionUserData(SESSION_USER_KEY_VALUE, sessionUserObject)

  // Moving to next window
  if (docSnap.data().user_type == USER_TYPE_CLIENT) {
    console.log("happening! Again");
    window.location.href = HOME_CLIENT;
  }

  if (docSnap.data().user_type == USER_TYPE_ARTIST) {
    window.location.href = HOME_ARTIST;
  }

}

function showCamera(taker) {
  if (taker == true) {
    TAKE_PHOTO_BUTTON.style.display = "block";
    VIDEO_HTML_ELEMENT.style.display = "block";
    CANVAS_HTML_ELEMENT.style.display = "block";
    STOP_CAM_BUTTON.style.display = "block";

    console.log('show camera')
  }
  else {
    TAKE_PHOTO_BUTTON.style.display = "none";
    VIDEO_HTML_ELEMENT.style.display = "none";
    CANVAS_HTML_ELEMENT.style.display = "none";
    STOP_CAM_BUTTON.style.display = "none";

    console.log('close and hide camera')
  }
}

function setEventButtonForStartCamera() {
  START_CAM_BUTTON.addEventListener('click', async function () {
    let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    VIDEO_HTML_ELEMENT.srcObject = stream;

    showCamera(true)
  });
}

function setEventButtonForTakePhoto() {
  TAKE_PHOTO_BUTTON.addEventListener('click', function () {
    CANVAS_HTML_ELEMENT.getContext('2d').drawImage(VIDEO_HTML_ELEMENT, 0, 0, CANVAS_HTML_ELEMENT.width, CANVAS_HTML_ELEMENT.height);
  });
}

function setEventButtonForStopCamera() {
  STOP_CAM_BUTTON.addEventListener('click', () => {
    const tracks = VIDEO_HTML_ELEMENT.srcObject.getTracks();
    tracks.forEach((track) => track.stop());

    showCamera(false);
  });
}

// function handleBlob(blob){

// }

function storePhotoInFireBaseStorage(newUser) {

  CANVAS_HTML_ELEMENT.toBlob(async (blob) => {
    const artistProfileRef = ref(storage, USER_PROFILE_COLLECTION + '/' + newUser.user.uid + '/' + PROFILE_PICTURE_NAME);
    await uploadBytes(artistProfileRef, blob)
      .then((snapshot) => {
        console.log(snapshot);
      });

  }, "image/jpg");
}


////////////////// EVENTS //////////////////

// CAMERA ============
setEventButtonForStartCamera();

setEventButtonForTakePhoto();

setEventButtonForStopCamera();



// SIGN UP EMAIL & PASSWORD ============

document.getElementById('signUpBtn').addEventListener('click', (e) => {
  e.preventDefault();

  //Getting the email and password values
  const userEmail = document.getElementById('emailUser').value;
  const userPassword = document.getElementById('passwordUser').value;

  if (document.title == SIGN_UP_CLIENT) {

    // createUserWithEmailAndPassword(auth, userEmail, userPassword) 
    createUserWithEmailAndPassword(auth, userEmail, userPassword)
      .then((newClient) => {
        // //save profile picture
        storePhotoInFireBaseStorage(newClient);

        setDoc(doc(CLIENTS_COLLECTION_REFERENCE, newClient.user.uid), {
          user_type: USER_TYPE_CLIENT,
          full_name: document.getElementById('fName').value,
          email: newClient.user.email,
          city: document.getElementById('city').value,
          postal_code: document.getElementById('postalCode').value,
          phone_number: document.getElementById('phoneNumber').value,
          uid: newClient.user.uid,

        }).then(() => {

          onAuthStateChanged(auth, (user) => {
            if (document.title == SIGN_UP_CLIENT_PAGE_NAME) {
              console.log("Pull");
              saveSessionUserDataOnSessionStorage("clients", user.uid);
            };
            if (document.title == SIGN_UP_ARTIST_PAGE_NAME) {
              saveSessionUserDataOnSessionStorage("artists", user.uid);
            };
          });

        });
      })
      .catch((err) => {
        console.log(err.code)
        console.log(err.message)
      })

  }

  if (document.title == SIGN_UP_ARTIST) {

    // createUserWithEmailAndPassword(auth, userEmail, userPassword) 
    createUserWithEmailAndPassword(auth, userEmail, userPassword)
      .then((newArtist) => {
        //save profile picture
        storePhotoInFireBaseStorage(newArtist);

        setDoc(doc(ARTISTS_COLLECTION_REFERENCE, newArtist.user.uid), {
          user_type: USER_TYPE_ARTIST,
          full_name: document.getElementById('artist_full_name').value,
          email: newArtist.user.email,
          city: document.getElementById('artist_city').value,
          postal_code: document.getElementById('artist_postal_code').value,
          phone_number: document.getElementById('artist_phone_number').value,
          bio: document.getElementById('artist_bio').value,
          website: document.getElementById('website_url').value,
          instagram: document.getElementById('instagram_url').value,
          uid: newArtist.user.uid

        }).then(() => {

          onAuthStateChanged(auth, (user) => {
            if (document.title == SIGN_UP_CLIENT_PAGE_NAME) {
              console.log("happening!");
              saveSessionUserDataOnSessionStorage("clients", user.uid);
            };
            if (document.title == SIGN_UP_ARTIST_PAGE_NAME) {
              saveSessionUserDataOnSessionStorage("artists", user.uid);
            };
          });

        });
      })
      .catch((err) => {
        console.log(err.code)
        console.log(err.message)
      })

  }


})

