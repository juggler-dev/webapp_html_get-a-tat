/* ////////////////////////// IMPORTS ////////////////////////// */

import { auth, storage, db } from "./firebase-init.js";
import { ARTISTS_COLLECTION_REFERENCE } from "./firestore-references.js";
import { ref, uploadBytes, getDownloadURL, getStorage, listAll, list } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-storage.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, signInWithRedirect, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js';
import { collection, doc, getDoc, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";
import { storeSessionUserData, readSessionUserData } from "./session-storage.js";

/* ////////////////////////// VARIABLES ////////////////////////// */

const uploadedImageArray = [];

const SESSION_USER_KEY_VALUE = "sessionUser";

const ARTISTS_IMG_UPLOADS_COLLECTION_NAME = 'artist-img-uploads';
const ARTIST_IMG_UPLOADS_STORAGE_FOLDER = "/artist-img-uploads";

const USER_PROFILE_COLLECTION = "user-profile";
const PROFILE_PICTURE_NAME = "profile.jpg";

const GALLERY_CONTAINER = document.querySelector(".gallery-container");
const MODAL_ELEMENT = document.querySelector(".modal-background");
const MODAL_CLOSER = document.querySelector(".modal-card-closer");
const MODAL_TO_GALLERY_BUTTON = document.querySelector(".modal-to-artist-gallery");
const BODY_ELEMENT = document.querySelector("body");





/* ////////////////////////// CLASSES   ////////////////////////// */

class ArtistUploadedImage {
  constructor(id, artistId, imgName) {
    this.id = id;
    this.artistId = artistId,
      this.imgName = imgName,
      this.url = ""
  }
}

class ArtistBioSmall {
  constructor(artistName, artistInstagram, artistProfileUrl) {
    this.artistName = artistName;
    this.artistInstagram = artistInstagram;
    this.artistProfileUrl = artistProfileUrl;
  }
}

/* ////////////////////////// FUNCTIONS ////////////////////////// */

// Building Functions ===================
function buildArtistUploadedImageObject(firebaseDocument) {
  return new ArtistUploadedImage(firebaseDocument.id, firebaseDocument.data().artist_id, firebaseDocument.data().img_name)
}

function buildUploadedArtistBioSmall(firebaseDocument, profileUrl) {
  return new ArtistBioSmall(firebaseDocument.data().full_name, firebaseDocument.data().instagram, profileUrl)
}


// Main Event Functions ===================

//fill image list array
async function fillImageArray(array) {

  const imagesUploadedFromArtist = await getDocs(collection(db, ARTISTS_IMG_UPLOADS_COLLECTION_NAME));
  imagesUploadedFromArtist.forEach((doc) => {
    const uploadedImgObject = buildArtistUploadedImageObject(doc);
    array.push(uploadedImgObject);
    console.log(uploadedImgObject);
  });
}

//Create images cards (buttons) from array
function createImageCards(array) {
  array.forEach(imageObject => {
    const artistUploadedImageToShowInGallery = document.createElement("button");
    artistUploadedImageToShowInGallery.class = "gallery-artist-uploaded-image";
    artistUploadedImageToShowInGallery.id = imageObject.id;

    const thumbnailRef = ref(storage, ARTIST_IMG_UPLOADS_STORAGE_FOLDER + '/' + imageObject.artistId + '/' + imageObject.imgName);
    getDownloadURL(thumbnailRef)
      .then((url) => {
        imageObject.url = url;
        const thumbnailImage = document.createElement("img");
        thumbnailImage.src = url;
        artistUploadedImageToShowInGallery.appendChild(thumbnailImage);
      })

    GALLERY_CONTAINER.appendChild(artistUploadedImageToShowInGallery);
    console.log(artistUploadedImageToShowInGallery);
  })
}

//Open Modal
function openModalAndReturnUploadedImageObj(array, modalElement, tattooExplorerButtonId) {
  modalElement.style.visibility = "visible";
  BODY_ELEMENT.style.overflowY = "hidden";
  const uploadedImgObj = array.find(image => image.id === tattooExplorerButtonId);
  return uploadedImgObj;
}

//Close Modal
function closeModal(modalElement) {
  modalElement.style.visibility = "hidden";
  BODY_ELEMENT.style.overflowY = "auto";
}

function setEventListenerToGalleryContainerForOpenModal() {
  GALLERY_CONTAINER.addEventListener('click', async (e) => {
    if (e.target.matches("button")) {
      // console.log("Clicked Button" + " " + e.target.id)
      const uploadedImgObj = openModalAndReturnUploadedImageObj(uploadedImageArray, MODAL_ELEMENT, e.target.id);
      await populateModalScreen(uploadedImgObj);
      setEventListenerToArtistGalleryButton(uploadedImgObj.artistId);
    }
  })
}

function setEventListenerToModalCardCloserForCloseModal() {
  MODAL_CLOSER.addEventListener('click', () => {
    closeModal(MODAL_ELEMENT);
  })
}

async function getArtistProfileUrl(artistId) {
  let profileUrl;

  const artistProfileRef = ref(storage, USER_PROFILE_COLLECTION + '/' + artistId + '/' + PROFILE_PICTURE_NAME);
  await getDownloadURL(artistProfileRef)
    .then((url) => {
      profileUrl = url;
    })

  return profileUrl;
}


//Get info from artist
async function getArtistInfo(artistId) {
  // Query
  const artistInfoRef = doc(db, "artists", artistId);
  const artistInfo = await getDoc(artistInfoRef);

  const artistProfilePhotoUrl = await getArtistProfileUrl(artistId)
  console.log(artistProfilePhotoUrl);

  return buildUploadedArtistBioSmall(artistInfo, artistProfilePhotoUrl)
}

//Populate modal
async function populateModalScreen(uploadedImgObject) {

  //Get artist info
  const artistInfo = await getArtistInfo(uploadedImgObject.artistId)

  document.querySelector(".modal-card-artist-name").innerHTML = artistInfo.artistName;
  document.querySelector(".modal-card-artist-instagram").innerHTML = artistInfo.artistInstagram;
  document.querySelector(".modal-card-image").src = uploadedImgObject.url;
  document.querySelector(".modal-artist-profile").src = artistInfo.artistProfileUrl;
}

// Main Event Functions ===================

function setEventListenerToArtistGalleryButton(artistId) {
  MODAL_TO_GALLERY_BUTTON.addEventListener('click', () => {
    sessionStorage.setItem("galleryId", artistId);
    window.location.href = "../pages/gallery-artist-main.html";
  })
}




/* ////////////////////////// EVENTS    ////////////////////////// */
await fillImageArray(uploadedImageArray);
console.log(uploadedImageArray);
createImageCards(uploadedImageArray);
await setEventListenerToGalleryContainerForOpenModal();
setEventListenerToModalCardCloserForCloseModal();
setEventListenerToArtistGalleryButton();





